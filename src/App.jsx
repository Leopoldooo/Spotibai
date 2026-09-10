import { useState } from "react";
import "./App.css";

const tracks = [
  {
    id: 1,
    title: "Lucky Rap",
    creator: "Spotibai",
    description: "A Spotibai original",
    duration: "0:42",
    emoji: "🎵",
  },
  {
    id: 2,
    title: "Funny Dialogue",
    creator: "Spotibai",
    description: "A funny audio clip",
    duration: "0:28",
    emoji: "😂",
  },
  {
    id: 3,
    title: "Singing Meme",
    creator: "Spotibai",
    description: "A singing meme",
    duration: "0:35",
    emoji: "🎤",
  },
  {
    id: 4,
    title: "Random Audio",
    creator: "Spotibai",
    description: "Something random",
    duration: "0:51",
    emoji: "🔊",
  },
];

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [currentTrack, setCurrentTrack] = useState(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  const [likedTracks, setLikedTracks] = useState(() => {
    const saved = localStorage.getItem("spotibai-liked");

    return saved ? JSON.parse(saved) : [];
  });

  const [playlists, setPlaylists] = useState(() => {
    const saved = localStorage.getItem("spotibai-playlists");

    return saved ? JSON.parse(saved) : [];
  });

  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false);
  const [playlistName, setPlaylistName] = useState("");

  const playTrack = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const toggleLike = (trackId) => {
    setLikedTracks((current) => {
      const updated = current.includes(trackId)
        ? current.filter((id) => id !== trackId)
        : [...current, trackId];

      localStorage.setItem("spotibai-liked", JSON.stringify(updated));

      return updated;
    });
  };

  const createPlaylist = () => {
    const name = playlistName.trim();

    if (!name) {
      return;
    }

    const newPlaylist = {
      id: Date.now(),
      name,
      tracks: [],
    };

    const updated = [...playlists, newPlaylist];

    setPlaylists(updated);
    localStorage.setItem("spotibai-playlists", JSON.stringify(updated));

    setPlaylistName("");
    setShowCreatePlaylist(false);
  };

  const deletePlaylist = (playlistId) => {
    const updated = playlists.filter(
      (playlist) => playlist.id !== playlistId
    );

    setPlaylists(updated);
    localStorage.setItem("spotibai-playlists", JSON.stringify(updated));

    if (selectedPlaylist?.id === playlistId) {
      setSelectedPlaylist(null);
    }
  };

  const addTrackToPlaylist = (playlistId, trackId) => {
    const updated = playlists.map((playlist) => {
      if (playlist.id !== playlistId) {
        return playlist;
      }

      if (playlist.tracks.includes(trackId)) {
        return playlist;
      }

      return {
        ...playlist,
        tracks: [...playlist.tracks, trackId],
      };
    });

    setPlaylists(updated);
    localStorage.setItem("spotibai-playlists", JSON.stringify(updated));
  };

  const removeTrackFromPlaylist = (playlistId, trackId) => {
    const updated = playlists.map((playlist) => {
      if (playlist.id !== playlistId) {
        return playlist;
      }

      return {
        ...playlist,
        tracks: playlist.tracks.filter((id) => id !== trackId),
      };
    });

    setPlaylists(updated);
    localStorage.setItem("spotibai-playlists", JSON.stringify(updated));

    const updatedSelected = updated.find(
      (playlist) => playlist.id === playlistId
    );

    setSelectedPlaylist(updatedSelected);
  };

  const likedTrackList = tracks.filter((track) =>
    likedTracks.includes(track.id)
  );

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="logo">spotibai</div>

        <nav>
          <button
            className={`nav-item ${currentPage === "home" ? "active" : ""}`}
            onClick={() => {
              setCurrentPage("home");
              setSelectedPlaylist(null);
            }}
          >
            <span>⌂</span>
            Home
          </button>

          <button className="nav-item">
            <span>🔍</span>
            Search
          </button>

          <button className="nav-item">
            <span>▣</span>
            Your Library
          </button>
        </nav>

        <div className="sidebar-section">
          <p className="section-title">Your stuff</p>

          <button
            className={`nav-item ${
              currentPage === "playlist" ? "active" : ""
            }`}
            onClick={() => {
              setCurrentPage("playlist");
              setSelectedPlaylist(null);
            }}
          >
            <span>＋</span>
            Playlist
          </button>

          <button
            className={`nav-item ${
              currentPage === "liked" ? "active" : ""
            }`}
            onClick={() => {
              setCurrentPage("liked");
              setSelectedPlaylist(null);
            }}
          >
            <span>♡</span>
            Liked Songs
          </button>
        </div>
      </aside>

      <main className="main-content">
        <header className="top-bar">
          <div className="navigation-buttons">
            <button>‹</button>
            <button>›</button>
          </div>

          <button className="profile-button">
            <span className="profile-icon">P</span>
            Phol
          </button>
        </header>

        {currentPage === "home" && (
          <>
            <section className="hero">
              <p className="eyebrow">WELCOME TO</p>

              <h1>Spotibai</h1>

              <p>
                Listen to music, memes, and whatever else makes your playlist.
              </p>

              <button
                className="primary-button"
                onClick={() => setCurrentPage("playlist")}
              >
                Playlist
              </button>
            </section>

            <section className="music-section">
              <div className="section-header">
                <h2>Recently added</h2>
                <button className="show-all">Show all</button>
              </div>

              <div className="music-grid">
                {tracks.map((track) => (
                  <TrackCard
                    key={track.id}
                    track={track}
                    isLiked={likedTracks.includes(track.id)}
                    onPlay={() => playTrack(track)}
                    onLike={() => toggleLike(track.id)}
                    playlists={playlists}
                    onAddToPlaylist={addTrackToPlaylist}
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {currentPage === "playlist" && !selectedPlaylist && (
          <section className="page-section">
            <div className="page-heading">
              <p className="eyebrow">YOUR MUSIC</p>

              <div className="page-title-row">
                <div>
                  <h1>Playlist</h1>
                  <p>Create playlists and organize your favorite tracks.</p>
                </div>

                <button
                  className="primary-button"
                  onClick={() => setShowCreatePlaylist(true)}
                >
                  + Create Playlist
                </button>
              </div>
            </div>

            {playlists.length === 0 ? (
              <div className="empty-playlist">
                <div className="empty-icon">＋</div>

                <h2>Create your first playlist</h2>

                <p>
                  Put your favorite Spotibai tracks together in one place.
                </p>

                <button
                  className="primary-button"
                  onClick={() => setShowCreatePlaylist(true)}
                >
                  Create Playlist
                </button>
              </div>
            ) : (
              <div className="playlist-grid">
                {playlists.map((playlist) => (
                  <div
                    className="playlist-card"
                    key={playlist.id}
                    onClick={() => setSelectedPlaylist(playlist)}
                  >
                    <div className="playlist-cover">♫</div>

                    <h3>{playlist.name}</h3>

                    <p>
                      {playlist.tracks.length}{" "}
                      {playlist.tracks.length === 1 ? "track" : "tracks"}
                    </p>

                    <button
                      className="delete-playlist"
                      onClick={(event) => {
                        event.stopPropagation();
                        deletePlaylist(playlist.id);
                      }}
                    >
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}

        {currentPage === "playlist" && selectedPlaylist && (
          <PlaylistPage
            playlist={selectedPlaylist}
            tracks={tracks}
            playlists={playlists}
            onBack={() => setSelectedPlaylist(null)}
            onPlay={playTrack}
            onRemove={removeTrackFromPlaylist}
          />
        )}

        {currentPage === "liked" && (
          <section className="page-section">
            <div className="liked-heading">
              <div className="liked-cover">♡</div>

              <div>
                <p className="eyebrow">YOUR COLLECTION</p>

                <h1>Liked Songs</h1>

                <p>
                  {likedTrackList.length}{" "}
                  {likedTrackList.length === 1 ? "track" : "tracks"}
                </p>
              </div>
            </div>

            {likedTrackList.length === 0 ? (
              <div className="empty-playlist">
                <div className="empty-icon">♡</div>

                <h2>Your liked songs will appear here</h2>

                <p>
                  Like a track and it will be added to this collection.
                </p>
              </div>
            ) : (
              <div className="track-list">
                {likedTrackList.map((track, index) => (
                  <TrackRow
                    key={track.id}
                    track={track}
                    index={index}
                    isLiked={true}
                    onLike={() => toggleLike(track.id)}
                    onPlay={() => playTrack(track)}
                  />
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {showCreatePlaylist && (
        <div className="modal-overlay">
          <div className="modal">
            <button
              className="modal-close"
              onClick={() => setShowCreatePlaylist(false)}
            >
              ×
            </button>

            <h2>Create Playlist</h2>

            <p>Give your new playlist a name.</p>

            <input
              type="text"
              value={playlistName}
              onChange={(event) => setPlaylistName(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  createPlaylist();
                }
              }}
              placeholder="Playlist name"
              autoFocus
            />

            <div className="modal-actions">
              <button
                className="secondary-button"
                onClick={() => setShowCreatePlaylist(false)}
              >
                Cancel
              </button>

              <button className="primary-button" onClick={createPlaylist}>
                Create
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="player">
        <div className="now-playing">
          <div className="mini-cover">{currentTrack.emoji}</div>

          <div>
            <h4>{currentTrack.title}</h4>
            <p>{currentTrack.creator}</p>
          </div>

          <button
            className={`player-like ${
              likedTracks.includes(currentTrack.id) ? "liked" : ""
            }`}
            onClick={() => toggleLike(currentTrack.id)}
          >
            {likedTracks.includes(currentTrack.id) ? "♥" : "♡"}
          </button>
        </div>

        <div className="player-controls">
          <div className="control-buttons">
            <button>↶</button>

            <button
              className="play-button"
              onClick={() => setIsPlaying(!isPlaying)}
            >
              {isPlaying ? "❚❚" : "▶"}
            </button>

            <button>↷</button>
          </div>

          <div className="progress-container">
            <span>0:00</span>

            <div className="progress-bar">
              <div className="progress"></div>
            </div>

            <span>{currentTrack.duration}</span>
          </div>
        </div>

        <div className="volume">
          <span>🔊</span>

          <div className="volume-bar">
            <div className="volume-level"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function TrackCard({
  track,
  isLiked,
  onPlay,
  onLike,
  playlists,
  onAddToPlaylist,
}) {
  return (
    <div className="music-card">
      <div className="music-cover cover-one">
        <span>{track.emoji}</span>

        <button className="card-play-button" onClick={onPlay}>
          ▶
        </button>
      </div>

      <div className="card-info">
        <div>
          <h3>{track.title}</h3>
          <p>{track.description}</p>
        </div>

        <button
          className={`like-button ${isLiked ? "liked" : ""}`}
          onClick={onLike}
        >
          {isLiked ? "♥" : "♡"}
        </button>
      </div>

      {playlists.length > 0 && (
        <select
          className="playlist-select"
          defaultValue=""
          onChange={(event) => {
            if (event.target.value) {
              onAddToPlaylist(
                Number(event.target.value),
                track.id
              );
              event.target.value = "";
            }
          }}
        >
          <option value="">+ Add to playlist</option>

          {playlists.map((playlist) => (
            <option key={playlist.id} value={playlist.id}>
              {playlist.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}

function TrackRow({
  track,
  index,
  isLiked,
  onLike,
  onPlay,
}) {
  return (
    <div className="track-row">
      <span className="track-number">{index + 1}</span>

      <div className="track-row-cover">{track.emoji}</div>

      <div className="track-row-info">
        <h3>{track.title}</h3>
        <p>{track.creator}</p>
      </div>

      <button
        className={`like-button ${isLiked ? "liked" : ""}`}
        onClick={onLike}
      >
        ♥
      </button>

      <button className="track-play-button" onClick={onPlay}>
        ▶
      </button>

      <span className="track-duration">{track.duration}</span>
    </div>
  );
}

function PlaylistPage({
  playlist,
  tracks,
  onBack,
  onPlay,
  onRemove,
}) {
  const playlistTracks = tracks.filter((track) =>
    playlist.tracks.includes(track.id)
  );

  return (
    <section className="page-section">
      <button className="back-button" onClick={onBack}>
        ← Back to playlists
      </button>

      <div className="liked-heading playlist-heading">
        <div className="liked-cover">♫</div>

        <div>
          <p className="eyebrow">PLAYLIST</p>

          <h1>{playlist.name}</h1>

          <p>
            {playlistTracks.length}{" "}
            {playlistTracks.length === 1 ? "track" : "tracks"}
          </p>
        </div>
      </div>

      {playlistTracks.length === 0 ? (
        <div className="empty-playlist">
          <div className="empty-icon">♫</div>

          <h2>This playlist is empty</h2>

          <p>
            Add tracks from the home page using the playlist menu.
          </p>
        </div>
      ) : (
        <div className="track-list">
          {playlistTracks.map((track, index) => (
            <div className="track-row" key={track.id}>
              <span className="track-number">{index + 1}</span>

              <div className="track-row-cover">{track.emoji}</div>

              <div className="track-row-info">
                <h3>{track.title}</h3>
                <p>{track.creator}</p>
              </div>

              <button
                className="track-play-button"
                onClick={() => onPlay(track)}
              >
                ▶
              </button>

              <button
                className="remove-track"
                onClick={() =>
                  onRemove(playlist.id, track.id)
                }
              >
                Remove
              </button>

              <span className="track-duration">
                {track.duration}
              </span>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default App;