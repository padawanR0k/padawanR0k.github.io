export default function YouTube({ id }) {
  return (
    <iframe
      style={{
        width: '90%',
        aspectRatio: '16 / 9',
      }}
      src={`https://www.youtube.com/embed/${id}`}
      title="YouTube Video"
      frameBorder="0"
    ></iframe>
  );
}
