import { useEffect, useRef, useState } from "react";
import "./App.css";

const featuredArtist = {
  name: "Spotibai",
  description:
    "The home of funny, memorable, and unexpected music from the Spotibai community.",
  image: "🎵",
};

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
  const [showComments, setShowComments] = useState(false);
  const [profile, setProfile] = useState(() => {
  const saved = localStorage.getItem("spotibai-profile");

  return saved
    ? JSON.parse(saved)
    : {
        name: "Phol",
        avatar: "👤",
      };
});

  const [showProfile, setShowProfile] = useState(false);
  const [profileName, setProfileName] = useState(profile.name);
  const [profileAvatar, setProfileAvatar] = useState(profile.avatar);
  const [showCropper, setShowCropper] = useState(false);
  const [cropImage, setCropImage] = useState(null);
  const [cropZoom, setCropZoom] = useState(1);
  const [cropPosition, setCropPosition] = useState({
  x: 0,
  y: 0,
});

const [cropImageDimensions, setCropImageDimensions] = useState({
  width: 0,
  height: 0,
});

const [isDragging, setIsDragging] = useState(false);

const [dragStart, setDragStart] = useState({
  x: 0,
  y: 0,
  startX: 0,
  startY: 0,
});
  const [comments, setComments] = useState(() => {
  const saved = localStorage.getItem("spotibai-comments");
  return saved ? JSON.parse(saved) : {};
});

const [commentText, setCommentText] = useState("");

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

const addComment = () => {
  const text = commentText.trim();

  if (!text) {
    return;
  }

  const newComment = {
  id: Date.now(),
  text,
  author: profile.name,
  avatar: profile.avatar,
};

  const updatedComments = {
    ...comments,
    [currentTrack.id]: [
      ...(comments[currentTrack.id] || []),
      newComment,
    ],
  };

  setComments(updatedComments);
  localStorage.setItem(
    "spotibai-comments",
    JSON.stringify(updatedComments)
  );

  setCommentText("");
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

  const handleProfilePictureChange = (event) => {
  const file = event.target.files[0];

  if (!file) {
    return;
  }

  const reader = new FileReader();

  reader.onload = () => {
    setCropImage(reader.result);

    setCropZoom(1);

    setCropPosition({
      x: 0,
      y: 0,
    });

    setCropImageDimensions({
      width: 0,
      height: 0,
    });

    setShowCropper(true);
  };

  reader.readAsDataURL(file);
};

const handleCropPointerDown = (event) => {
  event.currentTarget.setPointerCapture(event.pointerId);

  setIsDragging(true);

  setDragStart({
    x: event.clientX,
    y: event.clientY,
    startX: cropPosition.x,
    startY: cropPosition.y,
  });
};

const handleCropPointerMove = (event) => {
  if (!isDragging || !cropImageDimensions.width) {
    return;
  }

  const moveX = event.clientX - dragStart.x;
  const moveY = event.clientY - dragStart.y;

  const cropSize = 300;

  const baseScale = Math.max(
    cropSize / cropImageDimensions.width,
    cropSize / cropImageDimensions.height
  );

  const scale = baseScale * cropZoom;

  const imageWidth = cropImageDimensions.width * scale;
  const imageHeight = cropImageDimensions.height * scale;

  const maxX = Math.max(0, (imageWidth - cropSize) / 2);
  const maxY = Math.max(0, (imageHeight - cropSize) / 2);

  const newX = Math.max(
    -maxX,
    Math.min(maxX, dragStart.startX + moveX)
  );

  const newY = Math.max(
    -maxY,
    Math.min(maxY, dragStart.startY + moveY)
  );

  setCropPosition({
    x: newX,
    y: newY,
  });
};

const handleCropPointerUp = (event) => {
  setIsDragging(false);

  if (event.currentTarget.hasPointerCapture(event.pointerId)) {
    event.currentTarget.releasePointerCapture(event.pointerId);
  }
};

const createCroppedImage = () => {
  if (!cropImage || !cropImageDimensions.width) {
    return;
  }

  const image = new Image();

  image.onload = () => {
    const cropSize = 512;

    const canvas = document.createElement("canvas");

    canvas.width = cropSize;
    canvas.height = cropSize;

    const context = canvas.getContext("2d");

    if (!context) {
      return;
    }

    const baseScale = Math.max(
      cropSize / image.naturalWidth,
      cropSize / image.naturalHeight
    );

    const scale = baseScale * cropZoom;

    const imageWidth = image.naturalWidth * scale;
    const imageHeight = image.naturalHeight * scale;

    const drawX =
      cropSize / 2 -
      imageWidth / 2 +
      cropPosition.x * (cropSize / 300);

    const drawY =
      cropSize / 2 -
      imageHeight / 2 +
      cropPosition.y * (cropSize / 300);

    context.clearRect(0, 0, cropSize, cropSize);

    context.beginPath();
    context.arc(
      cropSize / 2,
      cropSize / 2,
      cropSize / 2,
      0,
      Math.PI * 2
    );
    context.closePath();
    context.clip();

    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = "high";

    context.drawImage(
      image,
      drawX,
      drawY,
      imageWidth,
      imageHeight
    );

    const croppedImage = canvas.toDataURL("image/png");

    setProfileAvatar(croppedImage);
    setShowCropper(false);
    setCropImage(null);
  };

  image.src = cropImage;
};

  const saveProfile = () => {
  const name = profileName.trim();

  if (!name) {
    return;
  }

  const updatedProfile = {
    ...profile,
    name,
    avatar: profileAvatar,
  };

  setProfile(updatedProfile);
  localStorage.setItem(
    "spotibai-profile",
    JSON.stringify(updatedProfile)
  );

  setShowProfile(false);
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
        <div className="logo">
  <img src="/media/spotibai-logo.png" alt="Spotibai" />
  <span className="logo-text">Spotibai</span>
</div>

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

          <button
  className="profile-button"
  onClick={() => {
    setProfileName(profile.name);
    setShowProfile(!showProfile);
  }}
>
  <span className="profile-icon">
  {profile.avatar?.startsWith("data:image") ? (
    <img
      src={profile.avatar}
      alt="Profile"
    />
  ) : (
    profile.avatar
  )}
</span>
 <span className="profile-name">{profile.name}</span>
</button>
        </header>

        {currentPage === "home" && (
          <>
            <section className="featured-artist">
  <p className="eyebrow">FEATURED ARTIST</p>

  <div className="featured-artist-content">
    <div className="featured-artist-image">
      {featuredArtist.image}
    </div>

    <div className="featured-artist-info">
      <p className="featured-label">Artist</p>

      <h1>{featuredArtist.name}</h1>

      <p>
        {featuredArtist.description}
      </p>

      <button
        className="primary-button"
        onClick={() => playTrack(tracks[0])}
      >
        ▶ Play
      </button>
    </div>
  </div>
</section>

            <section className="music-section recently-added-section">
              <div className="section-header">
                <h2 className="recently-added-title">Recently Added</h2>
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

            <section className="music-section popular-songs-section">
  <div className="section-header">
<h2 className="popular-songs-title">Popular Songs</h2>    <button className="show-all">Show all</button>
  </div>

  <div className="track-list home-track-list">
    {tracks.map((track, index) => (
      <TrackRow
        key={track.id}
        track={track}
        index={index}
        isLiked={likedTracks.includes(track.id)}
        onLike={() => toggleLike(track.id)}
        onPlay={() => playTrack(track)}
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

{showProfile && (
  <div className="profile-panel">
    <div className="profile-header">
      <div>
        <p className="eyebrow">Profile</p>
        <h2>Your Profile</h2>
      </div>

      <div className="profile-avatar-large">
  {profileAvatar?.startsWith("data:image") ? (
    <img
      src={profileAvatar}
      alt="Profile"
    />
  ) : (
    profileAvatar
  )}
</div>

      <button
        className="profile-close"
        onClick={() => setShowProfile(false)}
      >
        ×
      </button>
    </div>

    <label className="profile-picture-label">
  Profile picture
</label>

<input
  type="file"
  accept="image/*"
  onChange={handleProfilePictureChange}
/>

    <label>Display name</label>

    <input
      type="text"
      value={profileName}
      onChange={(event) => setProfileName(event.target.value)}
    />

    <button
      className="profile-save"
      onClick={saveProfile}
    >
      Save Profile
    </button>
  </div>
)}

{showCropper && (
  <div className="cropper-overlay">
    <div className="cropper-modal">
      <div className="cropper-header">
        <div>
          <p className="eyebrow">PROFILE PICTURE</p>
          <h2>Adjust your picture</h2>
        </div>

        <button
          className="cropper-close"
          onClick={() => {
            setShowCropper(false);
            setCropImage(null);
          }}
        >
          ×
        </button>
      </div>

      <div
  className={`crop-area ${isDragging ? "dragging" : ""}`}
  onPointerDown={handleCropPointerDown}
  onPointerMove={handleCropPointerMove}
  onPointerUp={handleCropPointerUp}
  onPointerCancel={handleCropPointerUp}
>
  {cropImage && (
    <img
      src={cropImage}
      alt="Crop preview"
      className="crop-image"
      onLoad={(event) => {
        setCropImageDimensions({
          width: event.currentTarget.naturalWidth,
          height: event.currentTarget.naturalHeight,
        });
      }}
      style={{
  transform: `translate(-50%, -50%) translate(${cropPosition.x}px, ${cropPosition.y}px) scale(${(() => {
    if (!cropImageDimensions.width || !cropImageDimensions.height) {
      return 1;
    }

    const cropSize = 300;

    const baseScale = Math.max(
      cropSize / cropImageDimensions.width,
      cropSize / cropImageDimensions.height
    );

    return baseScale * cropZoom;
  })()})`,
}}
      draggable="false"
    />
  )}

  <div className="crop-circle"></div>
</div>

      <div className="crop-controls">
        <label>
          Zoom
        </label>

        <input
          type="range"
          min="1"
          max="3"
          step="0.01"
          value={cropZoom}
          onChange={(event) =>
            setCropZoom(Number(event.target.value))
          }
        />
      </div>

      <div className="cropper-actions">
        <button
          className="secondary-button"
          onClick={() => {
            setShowCropper(false);
            setCropImage(null);
          }}
        >
          Cancel
        </button>

        <button
  className="primary-button"
  onClick={createCroppedImage}
>
  Use Picture
</button>
      </div>
    </div>
  </div>
)}

{showComments && (
  <div className="comments-panel">
    <div className="comments-header">
      <div>
        <p className="eyebrow">Comments</p>
        <h2>{currentTrack.title}</h2>
      </div>

      <button
        className="comments-close"
        onClick={() => setShowComments(false)}
      >
        ×
      </button>
    </div>

    <div className="comments-list">
      {(comments[currentTrack.id] || []).length === 0 ? (
        <p className="no-comments">
          No comments yet. Be the first to comment!
        </p>
      ) : (
        comments[currentTrack.id].map((comment) => (
          <div className="comment" key={comment.id}>
            <div className="comment-avatar">
  {comment.avatar?.startsWith("data:image") ? (
    <img
      src={comment.avatar}
      alt={comment.author}
    />
  ) : (
    comment.avatar || "👤"
  )}
</div>

            <div className="comment-content">
              <strong>{comment.author}</strong>
              <p>{comment.text}</p>
            </div>
          </div>
        ))
      )}
    </div>

    <div className="comment-input-container">
      <input
        type="text"
        placeholder="Write a comment..."
        value={commentText}
        onChange={(event) => setCommentText(event.target.value)}
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            addComment();
          }
        }}
      />

      <button onClick={addComment}>
        Post
      </button>
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
  className="comments-button"
  onClick={() => setShowComments(!showComments)}
>
  💬
</button>
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