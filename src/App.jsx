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
  const [likedTracks, setLikedTracks] = useState([]);

  const playTrack = (track) => {
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const toggleLike = (trackId) => {
    setLikedTracks((current) => {
      if (current.includes(trackId)) {
        return current.filter((id) => id !== trackId);
      }

      return [...current, trackId];
    });
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
            onClick={() => setCurrentPage("home")}
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
            onClick={() => setCurrentPage("playlist")}
          >
            <span>＋</span>
            Playlist
          </button>

          <button
            className={`nav-item ${
              currentPage === "liked" ? "active" : ""
            }`}
            onClick={() => setCurrentPage("liked")}
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
                  />
                ))}
              </div>
            </section>
          </>
        )}

        {currentPage === "playlist" && (
          <section className="page-section">
            <div className="page-heading">
              <p className="eyebrow">YOUR MUSIC</p>
              <h1>Playlist</h1>
              <p>Create playlists and fill them with your favorite tracks.</p>
            </div>

            <div className="empty-playlist">
              <div className="empty-icon">＋</div>
              <h2>Create your first playlist</h2>
              <p>
                Put your favorite Spotibai tracks together in one place.
              </p>
              <button className="primary-button">
                Create Playlist
              </button>
            </div>
          </section>
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
                  <div className="track-row" key={track.id}>
                    <span className="track-number">{index + 1}</span>

                    <div className="track-row-cover">
                      {track.emoji}
                    </div>

                    <div className="track-row-info">
                      <h3>{track.title}</h3>
                      <p>{track.creator}</p>
                    </div>

                    <button
                      className="like-button liked"
                      onClick={() => toggleLike(track.id)}
                    >
                      ♥
                    </button>

                    <button
                      className="track-play-button"
                      onClick={() => playTrack(track)}
                    >
                      ▶
                    </button>

                    <span className="track-duration">
                      {track.duration}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

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

function TrackCard({ track, isLiked, onPlay, onLike }) {
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
    </div>
  );
}

export default App;