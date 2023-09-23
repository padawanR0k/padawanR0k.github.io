export interface OgData {
  title: string;
}

export const Thumbnail = (props: OgData) => (
    <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          fontFamily: "Pretendard-Bold",
          backgroundColor: "white",
          backgroundImage:
              "radial-gradient(circle at 25px 25px, lightgray 2%, transparent 0%), radial-gradient(circle at 75px 75px, lightgray 2%, transparent 0%)",
          backgroundSize: "100px 100px",
        }}
    >
      <div
          style={{
            padding: "20px",
            display: "flex",
            width: "100%",
            height: "100%",
            justifyContent: "center",
          }}
      >
        <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              border: "1px solid #374151",
              boxShadow: "5px 5px 0px #374151",
              width: "100%",
              height: "100%",
              padding: "10px",
            }}
        >
          <div
              style={{
                fontSize: "32px",
                fontWeight: "900",
                lineHeight: "3rem",
                padding: "10px 0 50px 0",
                color: "#374151",
                flex: 1,
                display: "flex",
              }}
          >
            {props.title}
          </div>
          <div
              style={{
                fontSize: "16px",
                fontWeight: "900",
                color: "#374151",
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
              }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <span style={{ marginRight: "16px" }}>- R0K -</span>
            </div>
          </div>
        </div>
      </div>
    </div>
);

