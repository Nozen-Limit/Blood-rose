/* Renders a real YouTube embed when `youtubeId` is set, otherwise the dashed
   placeholder box — so adding a video later means filling in one field in
   the admin panel, not editing markup. */
export type VideoItem = { title: string; youtubeId?: string; url?: string };

export default function VideoCard({ item }: { item: VideoItem }) {
  return (
    <div className="video-card">
      {item.youtubeId ? (
        <iframe
          className="video-embed"
          src={`https://www.youtube.com/embed/${item.youtubeId}`}
          title={item.title || "Video"}
          loading="lazy"
          allow="accelerometer; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          frameBorder="0"
        />
      ) : (
        <div className="video-placeholder" aria-hidden="true">Video placeholder</div>
      )}

      <p className="video-title">{item.title || "Untitled"}</p>

      {item.url && (
        /* noopener stops the opened tab from being able to script this one */
        <a href={item.url} target="_blank" rel="noopener">Watch on YouTube</a>
      )}
    </div>
  );
}
