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

const artists = [
  {
    id: 1,
    name: "Spotibai",
    description:
      "The home of funny, memorable, and unexpected music from the Spotibai community.",
    image: "🎵",
  },
  {
    id: 2,
    name: "EYY",
    description:
      "Funny and unexpected sounds from the Spotibai community.",
    image: "😂",
  },
  {
    id: 3,
    name: "The 1975 - Jake Cuenca, Joseph Marco, and Enrique Gil",
    description:
      "The 1975 at home. Featuring unforgettable Filipino meme performances.",
    image: "🎤",
  },
  {
    id: 4,
    name: "Bai",
    description:
      "Memorable sounds and songs from Bai.",
    image: "🔊",
  },
];

const albums = [
  {
    id: 1,
    title: "Spotibai Originals",
    artist: "Spotibai",
    description: "Funny, memorable, and unexpected music.",
    image: "🎵",
    tracks: [1],
  },
  {
    id: 2,
    title: "Spotibai Memes",
    artist: "Spotibai",
    description: "A collection of unforgettable meme songs.",
    image: "😂",
    tracks: [2, 3, 4],
  },
];

function App() {
  const [currentPage, setCurrentPage] = useState("home");
const [navigationHistory, setNavigationHistory] = useState([
  {
    page: "home",
    playlistId: null,
  },
]);
  const [navigationIndex, setNavigationIndex] = useState(0);
  const [isNavigatingHistory, setIsNavigatingHistory] = useState(false);
  const [currentTrack, setCurrentTrack] = useState(tracks[0]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playQueue, setPlayQueue] = useState(tracks);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  /* sa lyrics editor */

  const [showLyricsEditor, setShowLyricsEditor] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPassword, setAdminPassword] = useState("");
  const [lyricsEditorTrack, setLyricsEditorTrack] = useState(null);
  const [editorLyrics, setEditorLyrics] = useState([]);
  const [editorLineText, setEditorLineText] = useState("");
  const [editorCurrentTime, setEditorCurrentTime] = useState(0);
  const [editorActiveLyricIndex, setEditorActiveLyricIndex] =
  useState(-1);
  const [editingLyricIndex, setEditingLyricIndex] = useState(null);

  const lyricsEditorAudioRef = useRef(null);

  const audioRef = useRef(null);

  const lyricsContentRef = useRef(null);

  useEffect(() => {
  const params = new URLSearchParams(window.location.search);

  if (params.get("admin") !== "lyrics") {
    return;
  }

  setShowAdminLogin(true);
}, []);

  const navigateToPage = (page, playlistId = null) => {
  if (isNavigatingHistory) {
    return;
  }

  const currentEntry = navigationHistory[navigationIndex];

  if (
    currentEntry &&
    currentEntry.page === page &&
    currentEntry.playlistId === playlistId
  ) {
    return;
  }

  const newHistory = navigationHistory.slice(
    0,
    navigationIndex + 1
  );

  newHistory.push({
    page,
    playlistId,
  });

  setNavigationHistory(newHistory);
  setNavigationIndex(newHistory.length - 1);
  setCurrentPage(page);

  if (playlistId !== null) {
    const playlist = playlists.find(
      (item) => item.id === playlistId
    );

    if (playlist) {
      setSelectedPlaylist(playlist);
    }
  } else if (page === "playlist") {
    setSelectedPlaylist(null);
  }
};

const handleUndo = () => {
  if (navigationIndex <= 0) {
    return;
  }

  const newIndex = navigationIndex - 1;
  const entry = navigationHistory[newIndex];

  setIsNavigatingHistory(true);
  setNavigationIndex(newIndex);
  setCurrentPage(entry.page);

  if (entry.playlistId !== null) {
    const playlist = playlists.find(
      (item) => item.id === entry.playlistId
    );

    setSelectedPlaylist(playlist || null);
  } else {
    setSelectedPlaylist(null);
  }

  setTimeout(() => {
    setIsNavigatingHistory(false);
  }, 0);
};

const handleRedo = () => {
  if (navigationIndex >= navigationHistory.length - 1) {
    return;
  }

  const newIndex = navigationIndex + 1;
  const entry = navigationHistory[newIndex];

  setIsNavigatingHistory(true);
  setNavigationIndex(newIndex);
  setCurrentPage(entry.page);

  if (entry.playlistId !== null) {
    const playlist = playlists.find(
      (item) => item.id === entry.playlistId
    );

    setSelectedPlaylist(playlist || null);
  } else {
    setSelectedPlaylist(null);
  }

  setTimeout(() => {
    setIsNavigatingHistory(false);
  }, 0);
};

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
  const [searchCategory, setSearchCategory] = useState("all");
  const [selectedArtist, setSelectedArtist] = useState(null);
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [showLyrics, setShowLyrics] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [savedLyrics, setSavedLyrics] = useState(() => {
  const saved = localStorage.getItem("spotibai-lyrics");
  return saved ? JSON.parse(saved) : {};
});
  const [activeLyricIndex, setActiveLyricIndex] = useState(-1);
  const [showQueue, setShowQueue] = useState(false);
  const [draggedQueueTrack, setDraggedQueueTrack] = useState(null);
  const [dragOverQueueTrack, setDragOverQueueTrack] = useState(null);
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

const [replyText, setReplyText] = useState({});
const [openReplies, setOpenReplies] = useState({});
const [replyingTo, setReplyingTo] = useState({});

const [commentSort, setCommentSort] = useState("newest");

const [commentLikes, setCommentLikes] = useState(() => {
  const saved = localStorage.getItem("spotibai-comment-likes");

  return saved ? JSON.parse(saved) : {};
});

const formatEditorTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${String(remainingSeconds).padStart(
    2,
    "0"
  )}.${String(Math.floor((seconds % 1) * 100)).padStart(
    2,
    "0"
  )}`;
};

  const handleAdminLogin = () => {
  const correctPassword = "spotibai-admin";

  if (adminPassword !== correctPassword) {
    alert("Incorrect admin password.");
    return;
  }

  setAdminPassword("");
  setShowAdminLogin(false);
  setShowLyricsEditor(true);

  const savedLyrics = JSON.parse(
    localStorage.getItem("spotibai-lyrics") || "{}"
  );

  const savedTrackId = Number(
    localStorage.getItem(
      "spotibai-lyrics-editor-track"
    )
  );

  const selectedTrack =
    tracks.find((track) => track.id === savedTrackId) ||
    tracks[0];

  setLyricsEditorTrack(selectedTrack);

  setEditorLyrics(
    savedLyrics[selectedTrack.id] || []
  );
};

  const openLyricsEditor = (track) => {
  const savedLyrics = JSON.parse(
    localStorage.getItem("spotibai-lyrics") || "{}"
  );

  setLyricsEditorTrack(track);

  setEditorLyrics(
    savedLyrics[track.id] || []
  );

  setEditorLineText("");
  setEditorCurrentTime(0);
  setShowLyricsEditor(true);
};

const closeLyricsEditor = () => {
  if (lyricsEditorAudioRef.current) {
    lyricsEditorAudioRef.current.pause();
  }

  setShowLyricsEditor(false);
  setLyricsEditorTrack(null);
  setEditorLyrics([]);
  setEditorLineText("");
  setEditorCurrentTime(0);
  setEditorActiveLyricIndex(-1);
};

const addSyncedLyric = () => {
  const text = editorLineText.trim();

  if (!text || !lyricsEditorAudioRef.current) {
    return;
  }

  const currentTime =
    lyricsEditorAudioRef.current.currentTime;

  if (editingLyricIndex !== null) {
    setEditorLyrics((current) =>
      current
        .map((line, index) =>
          index === editingLyricIndex
            ? {
                ...line,
                time: currentTime,
                text,
              }
            : line
        )
        .sort((a, b) => a.time - b.time)
    );

    setEditingLyricIndex(null);
    setEditorLineText("");
    return;
  }

  const newLyric = {
    time: currentTime,
    text,
  };

  setEditorLyrics((current) =>
    [...current, newLyric].sort(
      (a, b) => a.time - b.time
    )
  );

  setEditorLineText("");
};

const deleteSyncedLyric = (index) => {
  setEditorLyrics((current) =>
    current.filter(
      (_, lyricIndex) => lyricIndex !== index
    )
  );
};

const saveEditorLyrics = () => {
  if (!lyricsEditorTrack) {
    return;
  }

  const savedLyrics = JSON.parse(
    localStorage.getItem("spotibai-lyrics") || "{}"
  );

  savedLyrics[lyricsEditorTrack.id] = [...editorLyrics].sort(
    (a, b) => a.time - b.time
  );

  localStorage.setItem(
    "spotibai-lyrics",
    JSON.stringify(savedLyrics)
  );

  setSavedLyrics(savedLyrics);

  alert("Lyrics saved!");
};

const clearEditorLyrics = () => {
  if (
    !window.confirm(
      "Are you sure you want to clear all synced lyrics for this song?"
    )
  ) {
    return;
  }

  setEditorLyrics([]);
};

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
  if (
    !showLyrics ||
    activeLyricIndex < 0 ||
    !lyricsContentRef.current
  ) {
    return;
  }

  const lyricElements =
    lyricsContentRef.current.querySelectorAll("p");

  const activeElement =
    lyricElements[activeLyricIndex];

  if (!activeElement) {
    return;
  }

  activeElement.scrollIntoView({
    behavior: "smooth",
    block: "center",
  });
}, [activeLyricIndex, showLyrics]);

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
    createdAt: Date.now(),
    replies: [],
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

const toggleCommentLike = (commentId, replyId = null) => {
  const key =
    replyId === null
      ? `comment-${commentId}`
      : `reply-${commentId}-${replyId}`;

  setCommentLikes((current) => {
    const updated = {
      ...current,
      [key]: !current[key],
    };

    localStorage.setItem(
      "spotibai-comment-likes",
      JSON.stringify(updated)
    );

    return updated;
  });
};

const getCommentLikeCount = (commentId, replyId = null) => {
  const key =
    replyId === null
      ? `comment-${commentId}`
      : `reply-${commentId}-${replyId}`;

  return commentLikes[key] ? 1 : 0;
};

const sortComments = (commentList) => {
  const sorted = [...commentList];

  if (commentSort === "top") {
    return sorted.sort((a, b) => {
      const aLikes = getCommentLikeCount(a.id);
      const bLikes = getCommentLikeCount(b.id);

      if (bLikes !== aLikes) {
        return bLikes - aLikes;
      }

      return (b.createdAt || 0) - (a.createdAt || 0);
    });
  }

  return sorted.sort(
    (a, b) =>
      (b.createdAt || 0) - (a.createdAt || 0)
  );
};

const deleteComment = (commentId) => {
  const updatedComments = {
    ...comments,
    [currentTrack.id]: (comments[currentTrack.id] || []).filter(
      (comment) => comment.id !== commentId
    ),
  };

  setComments(updatedComments);

  localStorage.setItem(
    "spotibai-comments",
    JSON.stringify(updatedComments)
  );
};

const addReply = (commentId, parentReplyId = null) => {
  const text = (replyText[commentId] || "").trim();

  if (!text) {
    return;
  }

  const newReply = {
    id: Date.now(),
    text,
    author: profile.name,
    avatar: profile.avatar,
    createdAt: Date.now(),
    parentReplyId,
  };

  const updatedComments = {
    ...comments,
    [currentTrack.id]: (comments[currentTrack.id] || []).map(
      (comment) => {
        if (comment.id !== commentId) {
          return comment;
        }

        return {
          ...comment,
          replies: [
            ...(comment.replies || []),
            newReply,
          ],
        };
      }
    ),
  };

  setComments(updatedComments);

  localStorage.setItem(
    "spotibai-comments",
    JSON.stringify(updatedComments)
  );

  setReplyText((current) => ({
    ...current,
    [commentId]: "",
  }));

  setReplyingTo((current) => ({
    ...current,
    [commentId]: null,
  }));
};

const toggleReplies = (commentId) => {
  setOpenReplies((current) => ({
    ...current,
    [commentId]: !current[commentId],
  }));
};

const deleteReply = (commentId, replyId) => {
  const updatedComments = {
    ...comments,
    [currentTrack.id]: (comments[currentTrack.id] || []).map(
      (comment) => {
        if (comment.id !== commentId) {
          return comment;
        }

        return {
          ...comment,
          replies: (comment.replies || []).filter(
            (reply) => reply.id !== replyId
          ),
        };
      }
    ),
  };

  setComments(updatedComments);

  localStorage.setItem(
    "spotibai-comments",
    JSON.stringify(updatedComments)
  );
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

  const removeFromQueue = (trackId) => {
  setPlayQueue((currentQueue) =>
    currentQueue.filter((track) => track.id !== trackId)
  );
};

const clearQueue = () => {
  setPlayQueue([currentTrack]);
};

const addToQueue = (track) => {
  setPlayQueue((currentQueue) => {
    if (currentQueue.some((item) => item.id === track.id)) {
      return currentQueue;
    }

    return [...currentQueue, track];
  });
};

const swapQueueTracks = (draggedId, targetId) => {
  if (
    draggedId === null ||
    targetId === null ||
    draggedId === targetId
  ) {
    return;
  }

  setPlayQueue((currentQueue) => {
    const draggedIndex = currentQueue.findIndex(
      (track) => track.id === draggedId
    );

    const targetIndex = currentQueue.findIndex(
      (track) => track.id === targetId
    );

    if (draggedIndex === -1 || targetIndex === -1) {
      return currentQueue;
    }

    const updatedQueue = [...currentQueue];

    const temp = updatedQueue[draggedIndex];
    updatedQueue[draggedIndex] = updatedQueue[targetIndex];
    updatedQueue[targetIndex] = temp;

    return updatedQueue;
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

  const normalizedSearch = searchQuery.trim().toLowerCase();

const filteredTracks = tracks.filter((track) => {
  if (!normalizedSearch) {
    return true;
  }

  return (
    track.title.toLowerCase().includes(normalizedSearch) ||
    track.creator.toLowerCase().includes(normalizedSearch) ||
    track.description.toLowerCase().includes(normalizedSearch)
  );
});

const filteredArtists = artists.filter((artist) => {
  if (!normalizedSearch) {
    return true;
  }

  return (
    artist.name.toLowerCase().includes(normalizedSearch) ||
    artist.description.toLowerCase().includes(normalizedSearch)
  );
});

const filteredAlbums = albums.filter((album) => {
  if (!normalizedSearch) {
    return true;
  }

  return (
    album.title.toLowerCase().includes(normalizedSearch) ||
    album.artist.toLowerCase().includes(normalizedSearch) ||
    album.description.toLowerCase().includes(normalizedSearch)
  );
});

const searchResults =
  searchCategory === "songs"
    ? filteredTracks
    : searchCategory === "artists"
    ? filteredArtists
    : searchCategory === "albums"
    ? filteredAlbums
    : {
        tracks: filteredTracks,
        artists: filteredArtists,
        albums: filteredAlbums,
      };

  const formatReplyUsername = (username) => {
  const maxLength = 12;

  if (!username) {
    return "";
  }

  const limitedUsername = username.slice(0, maxLength - 1);

  return `@${limitedUsername}`;
};

  const formatTime = (time) => {
    if (!time || isNaN(time)) {
      return "0:00";
    }

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  const formatCommentTime = (timestamp) => {
  if (!timestamp) {
    return "";
  }

  const now = Date.now();
  const difference = now - timestamp;

  const seconds = Math.floor(difference / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);

  if (seconds < 10) {
    return "just now";
  }

  if (minutes < 1) {
    return `${seconds} seconds ago`;
  }

  if (minutes < 60) {
    return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
  }

  if (hours < 24) {
    return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
  }

  return new Date(timestamp).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
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
            navigateToPage("home");
            setSelectedPlaylist(null);
            }}
          >
            <span>⌂</span>
            Home
          </button>

          <button
  className={`nav-item ${currentPage === "search" ? "active" : ""}`}
  onClick={() => {
    navigateToPage("search");
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
    navigateToPage("playlist");
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
    navigateToPage("liked");
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
  <button
    onClick={handleUndo}
    disabled={navigationIndex <= 0}
  >
    ‹
  </button>

  <button
    onClick={handleRedo}
    disabled={
      navigationIndex >= navigationHistory.length - 1
    }
  >
    ›
  </button>
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
  <div className="home-layout">
    <main className="home-main">
    <section className="featured-artist">
      <p className="eyebrow">FEATURED ARTIST</p>

      <div className="featured-artist-content">
        <div className="featured-artist-image">
          {featuredArtist.image}
        </div>

        <div className="featured-artist-info">
          <p className="featured-label">Artist</p>

          <h1>{featuredArtist.name}</h1>

          <p>{featuredArtist.description}</p>

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
            onAddToQueue={addToQueue}
          />
        ))}
      </div>
    </section>

    <section className="music-section popular-songs-section">
      <div className="section-header">
        <h2 className="popular-songs-title">Popular Songs</h2>
        <button className="show-all">Show all</button>
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
            onAddToQueue={addToQueue}
          />
        ))}
      </div>
    </section>
     </main>

      <aside className="artist-panel">
  <div className="artist-panel-header">
    Now Playing
  </div>

  <div className="artist-panel-image">
    {currentTrack.emoji}
  </div>

  <div className="artist-panel-song">
    <h2>{currentTrack.title}</h2>
    <p>{currentTrack.creator}</p>
  </div>

  <div className="artist-info-box">
    <h3>About the artist</h3>

    <p>
      {currentTrack.creator} is featured on Spotibai with
      funny, memorable, and unexpected music.
    </p>
  </div>

  <div className="queue-box">
    <h3>Next on queue</h3>

    {(() => {
      const currentIndex = playQueue.findIndex(
        (track) => track.id === currentTrack.id
      );

      const nextTrack =
        currentIndex >= 0
          ? playQueue[(currentIndex + 1) % playQueue.length]
          : playQueue[0];

      if (!nextTrack || nextTrack.id === currentTrack.id) {
        return (
          <p className="queue-empty">
            No other songs in queue
          </p>
        );
      }

      return (
        <button
          className="next-queue-item"
          onClick={() => playTrack(nextTrack, playQueue)}
        >
          <span className="next-queue-image">
            {nextTrack.emoji}
          </span>

          <span className="next-queue-info">
            <strong>{nextTrack.title}</strong>
            <small>{nextTrack.creator}</small>
          </span>
        </button>
      );
    })()}
  </div>
</aside>

  </div>
)}

        {currentPage === "search" && (
  <section className="page-section search-page">
    <div className="page-heading">
      <p className="eyebrow">DISCOVER</p>

      <h1>Search</h1>

      <p>Find tracks, artists, and albums on Spotibai.</p>
    </div>

    <div className="search-container">
      <span className="search-icon">🔍</span>

      <input
        type="text"
        className="search-input"
        placeholder="Search for a track, artist, or album..."
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

    <div className="search-filters">
      <button
        className={`search-filter ${
          searchCategory === "all" ? "active" : ""
        }`}
        onClick={() => setSearchCategory("all")}
      >
        All
      </button>

      <button
        className={`search-filter ${
          searchCategory === "songs" ? "active" : ""
        }`}
        onClick={() => setSearchCategory("songs")}
      >
        Songs
      </button>

      <button
        className={`search-filter ${
          searchCategory === "artists" ? "active" : ""
        }`}
        onClick={() => setSearchCategory("artists")}
      >
        Artists
      </button>

      <button
        className={`search-filter ${
          searchCategory === "albums" ? "active" : ""
        }`}
        onClick={() => setSearchCategory("albums")}
      >
        Albums
      </button>
    </div>

    {!searchQuery.trim() ? (
      <>
        {(searchCategory === "all" ||
          searchCategory === "songs") && (
          <section className="music-section search-recommended-section">
            <div className="section-header">
              <h2>Recommended Songs</h2>
            </div>

            <div className="track-list search-track-list">
              {tracks.map((track, index) => (
                <TrackRow
                  key={track.id}
                  track={track}
                  index={index}
                  isLiked={likedTracks.includes(track.id)}
                  onLike={() => toggleLike(track.id)}
                  onPlay={() => playTrack(track)}
                  onAddToQueue={addToQueue}
                />
              ))}
            </div>
          </section>
        )}

        {(searchCategory === "all" ||
          searchCategory === "artists") && (
          <section className="music-section search-recommended-section">
            <div className="section-header">
              <h2>Recommended Artists</h2>
            </div>

            <div className="search-artists-grid">
              {artists.map((artist) => (
                <button
                  key={artist.id}
                  className="search-artist-card"
                  onClick={() => {
  setSelectedArtist(artist);
  navigateToPage("artist");
}}
                >
                  <div className="search-artist-image">
                    {artist.image}
                  </div>

                  <div className="search-artist-info">
                    <h3>{artist.name}</h3>
                    <p>Artist</p>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {(searchCategory === "all" ||
          searchCategory === "albums") && (
          <section className="music-section search-recommended-section">
            <div className="section-header">
              <h2>Recommended Albums</h2>
            </div>

            <div className="search-albums-grid">
              {albums.map((album) => (
                <button
  key={album.id}
  className="search-album-card"
  onClick={() => {
    setSelectedAlbum(album);
    setCurrentPage("album");
  }}
>
  <div className="search-album-image">
    {album.image}
  </div>

  <div className="search-album-info">
    <h3>{album.title}</h3>
    <p>{album.artist}</p>
  </div>
</button>
              ))}
            </div>
          </section>
        )}
      </>
    ) : (
      <>
        {searchCategory === "all" && (
          <>
            <section className="music-section search-results-section">
              <div className="section-header">
                <h2>Artists</h2>
              </div>

              {filteredArtists.length === 0 ? (
                <p className="search-empty-text">
                  No artists found.
                </p>
              ) : (
                <div className="search-artists-grid">
                  {filteredArtists.map((artist) => (
                    <button
                      key={artist.id}
                      className="search-artist-card"
                      onClick={() => {
  setSelectedArtist(artist);
  navigateToPage("artist");
}}
                    >
                      <div className="search-artist-image">
                        {artist.image}
                      </div>

                      <div className="search-artist-info">
                        <h3>{artist.name}</h3>
                        <p>Artist</p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </section>

            <section className="music-section search-results-section">
              <div className="section-header">
                <h2>Songs</h2>
              </div>

              {filteredTracks.length === 0 ? (
                <p className="search-empty-text">
                  No songs found.
                </p>
              ) : (
                <div className="track-list search-track-list">
                  {filteredTracks.map((track, index) => (
                    <TrackRow
                      key={track.id}
                      track={track}
                      index={index}
                      isLiked={likedTracks.includes(track.id)}
                      onLike={() => toggleLike(track.id)}
                      onPlay={() => playTrack(track)}
                      onAddToQueue={addToQueue}
                    />
                  ))}
                </div>
              )}
            </section>

            <section className="music-section search-results-section">
              <div className="section-header">
                <h2>Albums</h2>
              </div>

              {filteredAlbums.length === 0 ? (
                <p className="search-empty-text">
                  No albums found.
                </p>
              ) : (
                <div className="search-albums-grid">
                  {filteredAlbums.map((album) => (
                    <button
  key={album.id}
  className="search-album-card"
  onClick={() => {
    setSelectedAlbum(album);
    navigateToPage("album");
  }}
>
  <div className="search-album-image">
    {album.image}
  </div>

  <div className="search-album-info">
    <h3>{album.title}</h3>
    <p>{album.artist}</p>
  </div>
</button>
                  ))}
                </div>
              )}
            </section>
          </>
        )}

        {searchCategory === "songs" && (
          <section className="music-section search-results-section">
            <div className="section-header">
              <h2>Songs</h2>
              <span className="search-result-count">
                {filteredTracks.length}{" "}
                {filteredTracks.length === 1 ? "song" : "songs"}
              </span>
            </div>

            {filteredTracks.length === 0 ? (
              <div className="empty-playlist">
                <div className="empty-icon">🔍</div>

                <h2>No songs found</h2>

                <p>
                  Try searching for a different song or creator.
                </p>
              </div>
            ) : (
              <div className="track-list search-track-list">
                {filteredTracks.map((track, index) => (
                  <TrackRow
                    key={track.id}
                    track={track}
                    index={index}
                    isLiked={likedTracks.includes(track.id)}
                    onLike={() => toggleLike(track.id)}
                    onPlay={() => playTrack(track)}
                    onAddToQueue={addToQueue}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {searchCategory === "artists" && (
          <section className="music-section search-results-section">
            <div className="section-header">
              <h2>Artists</h2>
              <span className="search-result-count">
                {filteredArtists.length}{" "}
                {filteredArtists.length === 1 ? "artist" : "artists"}
              </span>
            </div>

            {filteredArtists.length === 0 ? (
              <div className="empty-playlist">
                <div className="empty-icon">👤</div>

                <h2>No artists found</h2>

                <p>
                  Try searching for a different artist.
                </p>
              </div>
            ) : (
              <div className="search-artists-grid">
                {filteredArtists.map((artist) => (
                  <button
                    key={artist.id}
                    className="search-artist-card"
                    onClick={() => {
  setSelectedArtist(artist);
  navigateToPage("artist");
}}
                  >
                    <div className="search-artist-image">
                      {artist.image}
                    </div>

                    <div className="search-artist-info">
                      <h3>{artist.name}</h3>
                      <p>Artist</p>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {searchCategory === "albums" && (
          <section className="music-section search-results-section">
            <div className="section-header">
              <h2>Albums</h2>
              <span className="search-result-count">
                {filteredAlbums.length}{" "}
                {filteredAlbums.length === 1 ? "album" : "albums"}
              </span>
            </div>

            {filteredAlbums.length === 0 ? (
              <div className="empty-playlist">
                <div className="empty-icon">💿</div>

                <h2>No albums found</h2>

                <p>
                  Try searching for a different album.
                </p>
              </div>
            ) : (
              <div className="search-albums-grid">
                {filteredAlbums.map((album) => (
                  <button
  key={album.id}
  className="search-album-card"
  onClick={() => {
    setSelectedAlbum(album);
    navigateToPage("album");
  }}
>
  <div className="search-album-image">
    {album.image}
  </div>

  <div className="search-album-info">
    <h3>{album.title}</h3>
    <p>{album.artist}</p>
  </div>
</button>
                ))}
              </div>
            )}
          </section>
        )}
      </>
    )}
  </section>
)}

{currentPage === "artist" && selectedArtist && (
  <section className="page-section artist-page">
    <button
      className="back-button"
      onClick={() => {
  setSelectedArtist(null);
  navigateToPage("search");
}}
    >
      ← Back to search
    </button>

    <div className="artist-profile-header">
      <div className="artist-profile-image">
        {selectedArtist.image}
      </div>

      <div className="artist-profile-info">
        <p className="eyebrow">ARTIST</p>

        <h1>{selectedArtist.name}</h1>

        <p>{selectedArtist.description}</p>
      </div>
    </div>

    <section className="music-section artist-songs-section">
      <div className="section-header">
        <h2>Songs</h2>
      </div>

      <div className="track-list">
        {tracks
          .filter(
            (track) =>
              track.creator.toLowerCase() ===
              selectedArtist.name.toLowerCase()
          )
          .map((track, index) => (
            <TrackRow
              key={track.id}
              track={track}
              index={index}
              isLiked={likedTracks.includes(track.id)}
              onLike={() => toggleLike(track.id)}
              onPlay={() => playTrack(track)}
              onAddToQueue={addToQueue}
            />
          ))}
      </div>
    </section>
  </section>
)}

{currentPage === "album" && selectedAlbum && (
  <section className="page-section album-page">
    <button
      className="back-button"
      onClick={() => {
  setSelectedArtist(null);
  navigateToPage("search");
}}
    >
      ← Back to search
    </button>

    <div className="album-profile-header">
      <div className="album-profile-image">
        {selectedAlbum.image}
      </div>

      <div className="album-profile-info">
        <p className="eyebrow">ALBUM</p>

        <h1>{selectedAlbum.title}</h1>

        <p className="album-artist-name">
          {selectedAlbum.artist}
        </p>

        <p>{selectedAlbum.description}</p>

        <p className="album-track-count">
          {selectedAlbum.tracks.length}{" "}
          {selectedAlbum.tracks.length === 1 ? "song" : "songs"}
        </p>
      </div>
    </div>

    <section className="music-section album-songs-section">
      <div className="section-header">
        <h2>Songs</h2>
      </div>

      <div className="track-list">
        {selectedAlbum.tracks
          .map((trackId) =>
            tracks.find((track) => track.id === trackId)
          )
          .filter(Boolean)
          .map((track, index) => (
            <TrackRow
              key={track.id}
              track={track}
              index={index}
              isLiked={likedTracks.includes(track.id)}
              onLike={() => toggleLike(track.id)}
              onAddToQueue={addToQueue}
              onPlay={() =>
                playTrack(
                  track,
                  selectedAlbum.tracks
                    .map((trackId) =>
                      tracks.find((track) => track.id === trackId)
                    )
                    .filter(Boolean)
                )
              }
            />
          ))}
      </div>
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
  onClick={() => {
    navigateToPage("playlist", playlist.id);
  }}
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
            onBack={() => {
  setSelectedPlaylist(null);
  navigateToPage("playlist");
}}
onAddToQueue={addToQueue}
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

      {/* LYRICS EDITOR */}

      {showAdminLogin && (
  <div className="admin-login-overlay">
    <div className="admin-login-modal">

      <div className="admin-login-icon">
        🔒
      </div>

      <p className="lyrics-editor-label">
        ADMIN ACCESS
      </p>

      <h2>Lyrics Editor</h2>

      <p className="admin-login-description">
        Enter the admin password to access the lyrics editor.
      </p>

      <input
        type="password"
        value={adminPassword}
        onChange={(event) =>
          setAdminPassword(event.target.value)
        }
        onKeyDown={(event) => {
          if (event.key === "Enter") {
            handleAdminLogin();
          }
        }}
        placeholder="Admin password"
        autoFocus
      />

      <div className="admin-login-actions">
        <button
          className="admin-login-cancel"
          onClick={() => {
            setAdminPassword("");
            setShowAdminLogin(false);
          }}
        >
          Cancel
        </button>

        <button
          className="admin-login-submit"
          onClick={handleAdminLogin}
        >
          Login
        </button>
      </div>

    </div>
  </div>
)}

      {showLyricsEditor && lyricsEditorTrack && (
        <div className="lyrics-editor-overlay">
          <div className="lyrics-editor">

            <div className="lyrics-editor-header">
              <div>
                <p className="lyrics-editor-label">
                  ADMIN
                </p>

                <h2>Lyrics Editor</h2>

                <p className="lyrics-editor-song">
                  {lyricsEditorTrack.title}
                </p>

                <span>
                  {lyricsEditorTrack.creator}
                </span>

              <select
  className="lyrics-editor-track-select"
  value={lyricsEditorTrack.id}
  onChange={(event) => {
    const selectedTrack = tracks.find(
      (track) => track.id === Number(event.target.value)
    );

    if (!selectedTrack) {
      return;
    }

    const savedLyrics = JSON.parse(
      localStorage.getItem("spotibai-lyrics") || "{}"
    );

    if (lyricsEditorAudioRef.current) {
  lyricsEditorAudioRef.current.pause();
  lyricsEditorAudioRef.current.currentTime = 0;
}

localStorage.setItem(
  "spotibai-lyrics-editor-track",
  String(selectedTrack.id)
);

setLyricsEditorTrack(selectedTrack);


setEditorLyrics(
  savedLyrics[selectedTrack.id] || []
);

setEditorLineText("");
setEditorCurrentTime(0);
setEditorActiveLyricIndex(-1);
  }}
>
  {tracks.map((track) => (
    <option key={track.id} value={track.id}>
      {track.title}
    </option>
  ))}
</select>

              </div>

              <button
                className="lyrics-editor-close"
                onClick={closeLyricsEditor}
              >
                ×
              </button>
            </div>

            <div className="lyrics-editor-content">

              <div className="lyrics-editor-player">

                <video
                  ref={lyricsEditorAudioRef}
                  src={lyricsEditorTrack.media}
                  className="lyrics-editor-video"
                  controls
                  onTimeUpdate={(event) => {
  const time = event.target.currentTime;

  setEditorCurrentTime(time);

  let currentIndex = -1;

  for (
    let index = 0;
    index < editorLyrics.length;
    index++
  ) {
    if (time >= editorLyrics[index].time) {
      currentIndex = index;
    } else {
      break;
    }
  }

  setEditorActiveLyricIndex(currentIndex);
}}
                />

                <div className="lyrics-editor-time">
                  {formatEditorTime(editorCurrentTime)}
                </div>

              </div>

              <div className="lyrics-editor-instructions">
                <h3>Sync your lyrics</h3>

                <p>
                  Play the song and type the lyric line.
                  When the lyric starts, press
                  <strong> Add Line</strong>.
                </p>
              </div>

              <div className="lyrics-editor-input">

                <input
                  type="text"
                  value={editorLineText}
                  onChange={(event) =>
                    setEditorLineText(event.target.value)
                  }
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      addSyncedLyric();
                    }
                  }}
                  placeholder="Type the lyric line..."
                  maxLength={500}
                />

                <button
  onClick={addSyncedLyric}
  disabled={!editorLineText.trim()}
>
  {editingLyricIndex !== null
    ? "Update Line"
    : "Add Line"}
</button>

{editingLyricIndex !== null && (
  <button
    className="lyrics-editor-cancel-edit"
    onClick={() => {
      setEditingLyricIndex(null);
      setEditorLineText("");
    }}
  >
    Cancel
  </button>
)}

              </div>

              <div className="lyrics-editor-actions">

                <button
                  className="lyrics-editor-save"
                  onClick={saveEditorLyrics}
                  disabled={editorLyrics.length === 0}
                >
                  Save Lyrics
                </button>

                <button
                  className="lyrics-editor-clear"
                  onClick={clearEditorLyrics}
                  disabled={editorLyrics.length === 0}
                >
                  Clear All
                </button>

              </div>

              <div className="lyrics-editor-list">

                {editorLyrics.length === 0 ? (
                  <div className="lyrics-editor-empty">
                    <div>♪</div>

                    <p>
                      No lyrics have been synced yet.
                    </p>

                    <span>
                      Play the song and add your first line.
                    </span>
                  </div>
                ) : (
                  editorLyrics.map((line, index) => (
                    <div
  className={`lyrics-editor-line ${
    index === editorActiveLyricIndex
      ? "editor-active-lyric"
      : ""
  }`}
  key={`${line.time}-${index}`}
>

<button
  className="lyrics-editor-timestamp"
  onClick={() => {
    if (lyricsEditorAudioRef.current) {
      lyricsEditorAudioRef.current.currentTime =
        line.time;

      setEditorCurrentTime(line.time);
    }
  }}
>
  {formatEditorTime(line.time)}
</button>

<div className="lyrics-editor-time-adjust">
  <button
    onClick={() => {
      setEditorLyrics((current) =>
        current
          .map((item, lyricIndex) =>
            lyricIndex === index
              ? {
                  ...item,
                  time: Math.max(0, item.time - 0.1),
                }
              : item
          )
          .sort((a, b) => a.time - b.time)
      );
    }}
  >
    −0.1
  </button>

  <button
    onClick={() => {
      setEditorLyrics((current) =>
        current
          .map((item, lyricIndex) =>
            lyricIndex === index
              ? {
                  ...item,
                  time: item.time + 0.1,
                }
              : item
          )
          .sort((a, b) => a.time - b.time)
      );
    }}
  >
    +0.1
  </button>
</div>

<button
  className="lyrics-editor-line-text"
  onClick={() => {
    setEditingLyricIndex(index);
    setEditorLineText(line.text);
    setEditorCurrentTime(line.time);

    if (lyricsEditorAudioRef.current) {
      lyricsEditorAudioRef.current.currentTime =
        line.time;
    }
  }}
>
  {line.text}
</button>

                      <button
                        className="lyrics-editor-delete"
                        onClick={() =>
                          deleteSyncedLyric(index)
                        }
                      >
                        ×
                      </button>

                    </div>
                  ))
                )}

              </div>

            </div>
          </div>
        </div>
      )}

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
  if (!audioRef.current) {
    return;
  }

  const time = audioRef.current.currentTime;

  setCurrentTime(time);

  const lyrics = savedLyrics[currentTrack.id] || [];

  if (lyrics.length === 0) {
    setActiveLyricIndex(-1);
    return;
  }

  let currentIndex = -1;

  for (let index = 0; index < lyrics.length; index++) {
    if (time >= lyrics[index].time) {
      currentIndex = index;
    } else {
      break;
    }
  }

  setActiveLyricIndex(currentIndex);
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

  if (
    currentIndex === -1 ||
    currentIndex >= playQueue.length - 1
  ) {
    setIsPlaying(false);
    setCurrentTime(0);
    return;
  }

  const nextTrack = playQueue[currentIndex + 1];

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
    <div className="lyrics-window">

      <div className="lyrics-header">
        <div>
          <p className="eyebrow">LYRICS</p>
          <h2>{currentTrack.title}</h2>
        </div>

        <button
          className="lyrics-close"
          onClick={() => setShowLyrics(false)}
          aria-label="Close lyrics"
        >
          ×
        </button>
      </div>

      <div
        className="lyrics-content"
        ref={lyricsContentRef}
      >
        {savedLyrics[currentTrack.id]?.length > 0 ? (
          savedLyrics[currentTrack.id].map((line, index) => (
            <p
              key={`${line.time}-${index}`}
              className={
                index === activeLyricIndex
                  ? "active-lyric"
                  : index < activeLyricIndex
                  ? "past-lyric"
                  : ""
              }
              onClick={() => {
                if (!audioRef.current) {
                  return;
                }

                audioRef.current.currentTime = line.time;
                setCurrentTime(line.time);
              }}
            >
              {line.text}
            </p>
          ))
        ) : (
          <p>No synced lyrics available.</p>
        )}
      </div>

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
  <div className="comments-header-center">
    <h2>Comments</h2>

    <select
      className="comment-sort-select"
      value={commentSort}
      onChange={(event) =>
        setCommentSort(event.target.value)
      }
    >
      <option value="newest">
        New comments
      </option>

      <option value="top">
        Top liked
      </option>
    </select>
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
  sortComments(comments[currentTrack.id]).map((comment) => {
    const replies = comment.replies || [];

    const rootReplies = replies.filter(
      (reply) => !reply.parentReplyId
    );

    const nestedReplies = replies.filter(
      (reply) => reply.parentReplyId
    );

    return (
      <div className="comment-thread" key={comment.id}>
        <div className="comment">
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
            <div className="comment-author-row">
              <strong className="comment-author">
                {comment.author}
              </strong>

              <span className="comment-timestamp">
                {formatCommentTime(comment.createdAt)}
              </span>
            </div>

            <p>{comment.text}</p>

            <div className="comment-actions">
              <button
  className={`comment-like-button ${
    commentLikes[`comment-${comment.id}`]
      ? "liked"
      : ""
  }`}
  onClick={() =>
    toggleCommentLike(comment.id)
  }
>
  {commentLikes[`comment-${comment.id}`]
    ? "♥"
    : "♡"}

  <span>
    {getCommentLikeCount(comment.id)}
  </span>
</button>
              <button  
                onClick={() => {
                  setReplyingTo((current) => ({
                    ...current,
                    [comment.id]: null,
                  }));

                  setOpenReplies((current) => ({
                    ...current,
                    [comment.id]: true,
                  }));
                }}
              >
                Reply
              </button>

              <button
                onClick={() => deleteComment(comment.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>

        {replies.length > 0 && (
          <button
            className="replies-toggle"
            onClick={() => toggleReplies(comment.id)}
          >
            {openReplies[comment.id]
              ? "▲ Hide replies"
              : `▼ ${replies.length} ${
                  replies.length === 1 ? "reply" : "replies"
                }`}
          </button>
        )}

        {openReplies[comment.id] && (
          <div className="replies-list">
            {rootReplies.map((reply) => {
              const childReplies = nestedReplies.filter(
                (child) =>
                  child.parentReplyId === reply.id
              );

              return (
                <div key={reply.id}>
                  <div className="reply">
                    <div className="comment-avatar reply-avatar">
                      {reply.avatar?.startsWith("data:image") ? (
                        <img
                          src={reply.avatar}
                          alt={reply.author}
                        />
                      ) : (
                        reply.avatar || "👤"
                      )}
                    </div>

                    <div className="comment-content">
                      <div className="comment-author-row">
                        <strong className="comment-author">
                          {reply.author}
                        </strong>

                        <span className="comment-timestamp">
                          {formatCommentTime(reply.createdAt)}
                        </span>
                      </div>

                      <p>
                        {reply.text}
                      </p>

                      <div className="comment-actions">
                        <button
  className={`comment-like-button ${
    commentLikes[
      `reply-${comment.id}-${reply.id}`
    ]
      ? "liked"
      : ""
  }`}
  onClick={() =>
    toggleCommentLike(
      comment.id,
      reply.id
    )
  }
>
  {commentLikes[
    `reply-${comment.id}-${reply.id}`
  ]
    ? "♥"
    : "♡"}

  <span>
    {getCommentLikeCount(
      comment.id,
      reply.id
    )}
  </span>
</button>
                        <button
                          onClick={() => {
  setReplyingTo((current) => ({
    ...current,
    [comment.id]: reply.id,
  }));

  setReplyText((current) => ({
  ...current,
  [comment.id]: `${formatReplyUsername(reply.author)} `,
}));

  setOpenReplies((current) => ({
    ...current,
    [comment.id]: true,
  }));
}}
                        >
                          Reply
                        </button>

                        <button
                          onClick={() =>
                            deleteReply(
                              comment.id,
                              reply.id
                            )
                          }
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  {childReplies.map((childReply) => (
                    <div
                      className="nested-reply"
                      key={childReply.id}
                    >
                      <div className="comment-avatar reply-avatar">
                        {childReply.avatar?.startsWith(
                          "data:image"
                        ) ? (
                          <img
                            src={childReply.avatar}
                            alt={childReply.author}
                          />
                        ) : (
                          childReply.avatar || "👤"
                        )}
                      </div>

                      <div className="comment-content">
                        <div className="comment-author-row">
                          <strong className="comment-author">
                            {childReply.author}
                          </strong>

                          <span className="comment-timestamp">
                            {formatCommentTime(
                              childReply.createdAt
                            )}
                          </span>
                        </div>

                        <p>
                          {childReply.text}
                        </p>

                        <div className="comment-actions">
                          <button
  className={`comment-like-button ${
    commentLikes[
      `reply-${comment.id}-${childReply.id}`
    ]
      ? "liked"
      : ""
  }`}
  onClick={() =>
    toggleCommentLike(
      comment.id,
      childReply.id
    )
  }
>
  {commentLikes[
    `reply-${comment.id}-${childReply.id}`
  ]
    ? "♥"
    : "♡"}

  <span>
    {getCommentLikeCount(
      comment.id,
      childReply.id
    )}
  </span>
</button>
                          <button
                            onClick={() => {
  setReplyingTo((current) => ({
    ...current,
    [comment.id]: childReply.id,
  }));

  setReplyText((current) => ({
  ...current,
  [comment.id]: `${formatReplyUsername(childReply.author)} `,
}));

  setOpenReplies((current) => ({
    ...current,
    [comment.id]: true,
  }));
}}
                          >
                            Reply
                          </button>

                          <button
                            onClick={() =>
                              deleteReply(
                                comment.id,
                                childReply.id
                              )
                            }
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {openReplies[comment.id] && (
          <div className="reply-input-container">
            {replyingTo[comment.id] && (
              <div className="replying-to">
                Replying to{" "}
                <strong>
                  {
                    replies.find(
                      (reply) =>
                        reply.id ===
                        replyingTo[comment.id]
                    )?.author
                  }
                </strong>

                <button
                  onClick={() =>
                    setReplyingTo((current) => ({
                      ...current,
                      [comment.id]: null,
                    }))
                  }
                >
                  ×
                </button>
              </div>
            )}

            <input
              type="text"
              placeholder="Write a reply..."
              value={replyText[comment.id] || ""}
              maxLength={50}
              onChange={(event) =>
                setReplyText((current) => ({
                  ...current,
                  [comment.id]: event.target.value,
                }))
              }
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  addReply(
                    comment.id,
                    replyingTo[comment.id] || null
                  );
                }
              }}
            />

            <button
              onClick={() =>
                addReply(
                  comment.id,
                  replyingTo[comment.id] || null
                )
              }
            >
              Reply
            </button>
          </div>
        )}
      </div>
    );
  })
)}
</div>

    <div className="comment-input-container">
      <input
        type="text"
        placeholder="Write a comment..."
        maxLength={50}
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

{showQueue && (
  <div className="queue-panel">
    <div className="queue-panel-header">
      <div>
        <p className="eyebrow">PLAYING NEXT</p>
        <h2>Queue</h2>
      </div>

      <button
        className="queue-close"
        onClick={() => setShowQueue(false)}
      >
        ×
      </button>
    </div>

    <div className="queue-current">
      <p className="queue-section-label">
        Now playing
      </p>

      <div className="queue-track current">
        <div className="queue-track-cover">
          {currentTrack.emoji}
        </div>

        <div className="queue-track-info">
          <strong>{currentTrack.title}</strong>
          <span>{currentTrack.creator}</span>
        </div>

        <span className="queue-playing-icon">
          {isPlaying ? "♫" : "Ⅱ"}
        </span>
      </div>
    </div>

    <div className="queue-up-next">
      <div className="queue-section-header">
        <p className="queue-section-label">
          Next in queue
        </p>

        {playQueue.length > 1 && (
          <button
            className="queue-clear-button"
            onClick={clearQueue}
          >
            Clear
          </button>
        )}
      </div>

      {playQueue.filter(
        (track) => track.id !== currentTrack.id
      ).length === 0 ? (
        <div className="queue-empty-state">
          <span>☷</span>

          <p>No songs in queue</p>

          <small>
            Play a song from your library to build your queue.
          </small>
        </div>
      ) : (
        <div className="queue-track-list">
          {playQueue
            .filter(
              (track) => track.id !== currentTrack.id
            )
            .map((track) => (
              <div
  className={`queue-track ${
    draggedQueueTrack === track.id
      ? "queue-track-dragging"
      : ""
  } ${
    dragOverQueueTrack === track.id
      ? "queue-track-drag-over"
      : ""
  }`}
  key={track.id}
  onPointerDown={(event) => {
    if (event.pointerType === "mouse" && event.button !== 0) {
      return;
    }

    setDraggedQueueTrack(track.id);
    event.currentTarget.setPointerCapture(event.pointerId);
  }}
  onPointerMove={(event) => {
    if (draggedQueueTrack === null) {
      return;
    }

    const element = document.elementFromPoint(
      event.clientX,
      event.clientY
    );

    const queueItem = element?.closest(".queue-track");

    if (!queueItem) {
      setDragOverQueueTrack(null);
      return;
    }

    const targetId = Number(queueItem.dataset.trackId);

    if (!Number.isNaN(targetId)) {
      setDragOverQueueTrack(targetId);
    }
  }}
  onPointerUp={(event) => {
    if (draggedQueueTrack === null) {
      return;
    }

    const element = document.elementFromPoint(
      event.clientX,
      event.clientY
    );

    const queueItem = element?.closest(".queue-track");

    if (queueItem) {
      const targetId = Number(queueItem.dataset.trackId);

      if (!Number.isNaN(targetId)) {
        swapQueueTracks(
          draggedQueueTrack,
          targetId
        );
      }
    }

    setDraggedQueueTrack(null);
    setDragOverQueueTrack(null);

    try {
      event.currentTarget.releasePointerCapture(
        event.pointerId
      );
    } catch {}
  }}
  onPointerCancel={() => {
    setDraggedQueueTrack(null);
    setDragOverQueueTrack(null);
  }}
  data-track-id={track.id}
>
                <button
                  className="queue-track-main"
                  onClick={() =>
                    playTrack(track, playQueue)
                  }
                >
                  <div className="queue-track-cover">
                    {track.emoji}
                  </div>

                  <div className="queue-track-info">
                    <strong>{track.title}</strong>
                    <span>{track.creator}</span>
                  </div>
                </button>

                <button
                  className="queue-remove"
                  onClick={() =>
                    removeFromQueue(track.id)
                  }
                >
                  ×
                </button>
              </div>
            ))}
        </div>
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
  className="comments-button"
  onClick={() => {
  setShowComments(true);
  setShowQueue(false);
}}
>
  💬
</button>

<button
  className={`queue-button ${showQueue ? "active" : ""}`}
  onClick={() => {
    setShowQueue((current) => !current);
    setShowComments(false);
  }}
>
  ☷ Queue
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
  onAddToQueue,
})

{
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

  <div className="card-actions">
    <button
      className="queue-add-button"
      onClick={() => onAddToQueue(track)}
    >
      + Queue
    </button>

    <button
      className={`like-button ${isLiked ? "liked" : ""}`}
      onClick={onLike}
    >
      {isLiked ? "♥" : "♡"}
    </button>
  </div>
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
  onAddToQueue,
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
  onAddToQueue,

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
  className="queue-add-button row-queue-button"
  onClick={() => onAddToQueue(track)}
>
  + Queue
</button>

<button
  className="track-play-button"
  onClick={onPlay}
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