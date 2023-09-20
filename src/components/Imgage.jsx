const Imgage = ({ src }) => {
    if (src === "") {
        return;
    }
    let newSrc = require(`../assets/icon/${src}.png`);
    return <img src={newSrc} style={{ width: "100px", height: "100px" }} />;
};

export default Imgage;
