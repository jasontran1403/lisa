import { PageAnimation } from "../components/utils";

const SearchDataLayout = props => {
    return (
        <div className="min-h-screen bg-gray-100">
            <div className="flex w-full pt-32">
                <div className="w-full px-5 mt-0.5 transition-all duration-500">
                    <PageAnimation>{props.children}</PageAnimation>
                </div>
            </div>
        </div>
    );
};

export default SearchDataLayout;
