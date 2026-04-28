export const Error = () => {
  return (
    <div
      className="flex items-center justify-center"
      style={{ marginTop: "80px" }}
    >
      <p
        className="text-center"
        style={{
          fontWeight: "500",
          fontSize: "16px",
        }}
      >
        Something went wrong,
        <br /> Refresh and try again
      </p>
    </div>
  );
};
