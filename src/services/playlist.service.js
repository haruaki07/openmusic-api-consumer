class PlaylistService {
  #pool;

  /** @param {import("pg").Pool} pool */
  constructor(pool) {
    this.#pool = pool;
  }

  async findPlaylistSongs(playlistId) {
    const playlistResult = await this.#pool.query(
      `
SELECT 
  p.id, p.name
FROM 
  playlists p
JOIN users u
  ON u.id = p.owner
WHERE
  p.id=$1`,
      [playlistId]
    );

    if (playlistResult.rowCount < 1) throw new Error("Playlist not found");

    const playlist = playlistResult.rows[0];

    const songsResult = await this.#pool.query(
      `
SELECT 
  s.id, s.title, s.performer
FROM 
  playlist_songs ps
JOIN songs s
  ON s.id = ps."songId"
WHERE
  ps."playlistId" = $1`,
      [playlist.id]
    );

    return {
      ...playlist,
      songs: songsResult.rows
    };
  }
}

module.exports = PlaylistService;
