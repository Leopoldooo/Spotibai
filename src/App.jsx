import { useEffect, useRef, useState } from "react";
import "./App.css";

const tracks = [
{
  id: 1,
  title: "Lucky Rap",
  creator: "Spotibai",
  description: "MABANGIS",
  duration: "0:42",
  emoji: "🎵",
  media: "/media/lucky-rap.mp4",
  lyrics: [
    "Lucky Rap",
    "",
    "Subok lang tayo yah, hindi toh pull ah ",
    "Line 2 of the lyrics",
    "Line 3 of the lyrics"
  ]
},  {
    id: 2,
    title: "Hinarot",
    creator: "EYY",
    description: "Sa mga hinarot jan",
    duration: "0:28",
    emoji: "😂",
    media: "/media/hinarot-pusong-malambot.mp4",
  lyrics: [
    "Hinarot",
    "",
    "Subok lang tayo yah, hindi toh pull ah ",
    "Line 2 of the lyrics",
    "Line 3 of the lyrics"
  ]
  },
  {
    id: 3,
    title: "Chocolate",
    creator: "The 1975 - Jake Cuenca, Joseph Marco, and Enrique Gil ",
    description: "We got the 1975 at home",
    duration: "0:35",
    emoji: "🎤",
    media: "/media/1975-jake-cuenca.mp4",
  lyrics: [
    "Chocolate",
    "",
    "Subok lang tayo yah, hindi toh pull ah ",
    "Line 2 of the lyrics",
    "Line 3 of the lyrics"
  ]
  },
  {
    id: 4,
    title: "Wait A Minute",
    creator: "Bai",
    description: "best song ni bai",
    duration: "0:51",
    emoji: "🔊",
    media: "/media/wait-a-minute.mp4",
  lyrics: [
    "Wait A Minute",
    "",
    "Subok lang tayo yah, hindi toh pull ah ",
    "Line 2 of the lyrics",
    "Line 3 of the lyrics"
  ]
  },
];

function App() {
  const [currentPage, setCurrentPage] = useState("home");
  const [currentTrack, setCurrentTrack] = useState(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playQueue, setPlayQueue] = useState(tracks);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const audioRef = useRef(null);

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
  const [searchQuery, setSearchQuery] = useState("");
  const [showLyrics, setShowLyrics] = useState(false);

  const playTrack = (track, queue = tracks) => {
  setPlayQueue(queue);

  if (currentTrack.id === track.id && audioRef.current) {
    audioRef.current.currentTime = 0;
    setCurrentTime(0);

    if (track.media) {
      audioRef.current.play().catch(() => {
        setIsPlaying(false);
      });

      setIsPlaying(true);
    }

    return;
  }

  setCurrentTrack(track);
  setCurrentTime(0);
  setDuration(0);

  if (track.media) {
    setIsPlaying(true);
  } else {
    setIsPlaying(false);
  }
};

  useEffect(() => {
  if (!audioRef.current) {
    return;
  }

  const video = audioRef.current;

  if (isPlaying && currentTrack.media) {
    if (video.ended) {
      video.currentTime = 0;
    }

    video.play().catch(() => {
      setIsPlaying(false);
    });
  } else {
    video.pause();
  }
}, [isPlaying, currentTrack]);

useEffect(() => {
  if (!audioRef.current) {
    return;
  }

  audioRef.current.volume = volume;
}, [volume]);

useEffect(() => {
  const handleKeyDown = (event) => {
    if (event.code !== "Space") {
      return;
    }

    const activeElement = document.activeElement;

    if (
      activeElement &&
      (activeElement.tagName === "INPUT" ||
        activeElement.tagName === "TEXTAREA" ||
        activeElement.tagName === "BUTTON")
    ) {
      return;
    }

    event.preventDefault();

    if (!audioRef.current || !currentTrack.media) {
      return;
    }

    const video = audioRef.current;

    if (video.paused || video.ended) {
      if (video.ended) {
        video.currentTime = 0;
        setCurrentTime(0);
      }

      video.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  window.addEventListener("keydown", handleKeyDown);

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}, [currentTrack]);

  const handleProgressClick = (event) => {
    if (!audioRef.current || !duration) {
      return;
    }

    const progressBar = event.currentTarget;
    const rect = progressBar.getBoundingClientRect();

    const clickPosition = event.clientX - rect.left;
    const percentage = clickPosition / rect.width;

    audioRef.current.currentTime = percentage * duration;
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

  const searchResults = tracks.filter((track) => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return true;
    }

    return (
      track.title.toLowerCase().includes(query) ||
      track.creator.toLowerCase().includes(query) ||
      track.description.toLowerCase().includes(query)
    );
  });

  const formatTime = (time) => {
    if (!time || isNaN(time)) {
      return "0:00";
    }

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

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

          <button
            className={`nav-item ${currentPage === "search" ? "active" : ""}`}
            onClick={() => {
              setCurrentPage("search");
              setSelectedPlaylist(null);
            }}
          >
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

        {currentPage === "search" && (
          <section className="page-section">
            <div className="page-heading">
              <p className="eyebrow">DISCOVER</p>

              <h1>Search</h1>

              <p>Find tracks on Spotibai.</p>
            </div>

            <div className="search-container">
              <span className="search-icon">🔍</span>

              <input
                type="text"
                className="search-input"
                placeholder="Search for a track..."
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                autoFocus
              />

              {searchQuery && (
                <button
                  className="clear-search"
                  onClick={() => setSearchQuery("")}
                >
                  ×
                </button>
              )}
            </div>

            <section className="music-section search-results-section">
              <div className="section-header">
                <h2>
                  {searchQuery.trim()
                    ? `Results for "${searchQuery}"`
                    : "All tracks"}
                </h2>

                <span className="search-result-count">
                  {searchResults.length}{" "}
                  {searchResults.length === 1 ? "track" : "tracks"}
                </span>
              </div>

              {searchResults.length === 0 ? (
                <div className="empty-playlist">
                  <div className="empty-icon">🔍</div>

                  <h2>No tracks found</h2>

                  <p>
                    Try searching for a different track, creator, or
                    description.
                  </p>
                </div>
              ) : (
                <div className="music-grid">
                  {searchResults.map((track) => (
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
              )}
            </section>
          </section>
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
            onBack={() => setSelectedPlaylist(null)}
            onPlay={(track) => {
            const playlistTracks = tracks.filter((item) =>
            selectedPlaylist.tracks.includes(item.id)
         );

    playTrack(track, playlistTracks);
  }}
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
                    onPlay={() => playTrack(track, likedTrackList)}
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

      <video
        ref={audioRef}
        src={currentTrack.media || ""}
        onTimeUpdate={() => {
          if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime);
          }
        }}
        onLoadedMetadata={() => {
          if (audioRef.current) {
            setDuration(audioRef.current.duration);
          }
        }}
        onEnded={() => {
  const currentIndex = playQueue.findIndex(
    (track) => track.id === currentTrack.id
  );

  const nextIndex =
    currentIndex < playQueue.length - 1 ? currentIndex + 1 : 0;

  const nextTrack = playQueue[nextIndex];

  setCurrentTrack(nextTrack);
  setCurrentTime(0);
  setDuration(0);

  if (nextTrack.media) {
    setIsPlaying(true);
  } else {
    setIsPlaying(false);
  }
}}
        style={{ display: "none" }}
      />

{showLyrics && (
  <div className="lyrics-panel">
    <div className="lyrics-header">
      <div>
        <p className="eyebrow">LYRICS</p>
        <h2>{currentTrack.title}</h2>
      </div>

      <button
        className="lyrics-close"
        onClick={() => setShowLyrics(false)}
      >
        ×
      </button>
    </div>

    <div className="lyrics-content">
      {currentTrack.lyrics ? (
        currentTrack.lyrics.map((line, index) => (
          <p key={index}>{line || "\u00A0"}</p>
        ))
      ) : (
        <p>No lyrics available.</p>
      )}
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
            <button
  onClick={() => {
    const currentIndex = playQueue.findIndex(
      (track) => track.id === currentTrack.id
    );

    const previousIndex =
      currentIndex > 0 ? currentIndex - 1 : playQueue.length - 1;

    playTrack(playQueue[previousIndex], playQueue);
  }}
>
  ⏮
</button>

<button
  className="play-button"
  onClick={() => {
    if (!currentTrack.media) {
      return;
    }

    setIsPlaying(!isPlaying);
  }}
>
  {isPlaying ? "❚❚" : "▶"}
</button>

<button
  onClick={() => {
    const currentIndex = playQueue.findIndex(
      (track) => track.id === currentTrack.id
    );

    const nextIndex =
      currentIndex < playQueue.length - 1 ? currentIndex + 1 : 0;

    playTrack(playQueue[nextIndex], playQueue);
  }}
>
  ⏭
</button>
          </div>

          <div className="progress-container">
            <span>{formatTime(currentTime)}</span>

            <div
              className="progress-bar"
              onClick={handleProgressClick}
            >
              <div
                className="progress"
                style={{
                  width: duration
                    ? `${Math.min((currentTime / duration) * 100, 100)}%`
                    : "0%",
                }}
              ></div>
            </div>

            <span>{formatTime(duration)}</span>
          </div>
        </div>

        <div className="volume">
  <button
    className="lyrics-button"
    onClick={() => setShowLyrics(!showLyrics)}
  >
    Lyrics
  </button>

  <span>🔊</span>

<input
  type="range"
  min="0"
  max="1"
  step="0.01"
  value={volume}
  onChange={(event) => setVolume(Number(event.target.value))}
  style={{
    "--volume": volume,
  }}
  className="volume-slider"
/>
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