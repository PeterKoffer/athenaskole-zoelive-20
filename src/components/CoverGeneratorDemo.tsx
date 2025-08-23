export default function CoverGeneratorDemo() {
  const src =
    "https://yphkfkpfdpdmllotpqua.functions.supabase.co/cover-generator?title=My%20Article&author=Jane%20Doe&bg=264653&color=ffffff&v=" +
    Date.now(); // lille cache-bust
  return (
    <div style={{ padding: 24 }}>
      <h2>Cover-generator demo</h2>
      <img
        src={src}
        alt="Generated cover"
        style={{ maxWidth: "100%", height: "auto", borderRadius: 16 }}
      />
    </div>
  );
}
