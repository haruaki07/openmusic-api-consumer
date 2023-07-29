require("dotenv/config");
const { Pool } = require("pg");
const config = require("./config");
const amqp = require("amqp-connection-manager");
const PlaylistService = require("./services/playlist.service");
const MailService = require("./services/mail.service");

const queueName = "export:playlist";

const main = async () => {
  // init database pool
  const pool = new Pool({
    user: config.pg.user,
    password: config.pg.password,
    host: config.pg.host,
    port: config.pg.port,
    database: config.pg.database
  });

  const playlistService = new PlaylistService(pool);
  const mailService = new MailService();

  const conn = amqp.connect(config.rabbitmq.url);
  conn.on("connect", ({ url }) => console.log(`AMQP connected: ${url}`));
  conn.on("disconnect", ({ err }) => console.log(`AMQP disconnected: ${err}`));

  const chan = conn.createChannel({
    /** @param {amqp.Channel} channel */
    setup(channel) {
      return Promise.all([
        channel.assertQueue(queueName, { durable: true }),
        channel.prefetch(1),
        channel.consume(
          queueName,
          async (msg) => {
            try {
              /** @type {{ playlistId: string; targetEmail: string }} */
              const content = JSON.parse(msg.content.toString());
              console.log("Export: " + msg.content.toString());

              const playlist = await playlistService.findPlaylistSongs(
                content.playlistId
              );

              await mailService.sendPlaylistExportMail(
                content.targetEmail,
                playlist
              );
            } catch (e) {
              console.error("An error occurred while consuming message: ", e);
            }
          },
          { noAck: true }
        )
      ]);
    }
  });

  console.log("Listening for messages...");
  await chan.waitForConnect();
};

main();
