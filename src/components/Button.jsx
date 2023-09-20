import AddCircleOutlineRoundedIcon from "@mui/icons-material/AddCircleOutlineRounded";

const Button = ({ handleClick }) => {
    return (
        <AddCircleOutlineRoundedIcon
            onClick={handleClick}
            sx={{
                fontSize: "30px",
                cursor: "pointer",
                color: "blue"
            }}
        />
    );
};

export default Button;
