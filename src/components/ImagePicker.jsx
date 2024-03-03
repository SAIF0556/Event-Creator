export default function ImagePicker({ images, selectedImage, onSelect }) {
  const baseURL = 'https://event-creater-app.onrender.com'
  return (
    <div id="image-picker">
      <p>Select an image</p>
      <ul>
        {images.map((image) => (
          <li
            key={image.path}
            onClick={() => onSelect(image.path)}
            className={selectedImage === image.path ? 'selected' : undefined}
          >
            <img src={`${baseURL}/${image.path}`} alt={image.caption} />
          </li>
        ))}
      </ul>
    </div>
  )
}
