
const Wrapper = ({ className, children }) => {
    return (
        <div className={`flex flex-col min-h-screen md:w-auto w-full ${className}`}>
            {children}
        </div>
    );
}

export default Wrapper;