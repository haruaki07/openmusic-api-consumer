const config = require("../config");
const nodemailer = require("nodemailer");

class MailService {
  constructor() {
    this._transporter = nodemailer.createTransport({
      host: config.smtp.host,
      port: config.smtp.port,
      auth: {
        user: config.smtp.user,
        pass: config.smtp.password
      }
    });
  }

  /**
   * @param {string} targetEmail
   * @param {import("@/models/playlist").PlaylistSongsResponse} playlist
   * @returns
   */
  sendPlaylistExportMail(targetEmail, playlist) {
    return this._transporter.sendMail({
      from: config.smtp.user,
      to: targetEmail,
      subject: `Ekspor Playlist "${playlist.name}" Berhasil!`,
      text: `Silahkan unduh file lampiran pada email untuk melihat hasil ekspor.`,
      attachments: [
        {
          filename: `${playlist.id}.json`,
          content: JSON.stringify({ playlist })
        }
      ]
    });
  }
}

module.exports = MailService;
