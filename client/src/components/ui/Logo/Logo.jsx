import logoWithBg from '../../../assets/logo/payly-web-bg.png';
import logoWithoutBg from '../../../assets/logo/payly-web-no-bg.png';
import logoFull from '../../../assets/logo/payly-full.png';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';

const Logo = ({
    className = '',
    sideText = false,
    textClassName = 'font-bold text-white text-xl hidden md:block',
    onClickHomepageNavigate = true,
    background = false
}) => {

    let logo = background ? logoWithBg : logoWithoutBg;
    
    if (sideText) {
        logo = logoFull;
    }

    const navigate = useNavigate();

    return (
        <div className={`flex items-center gap-2 ${onClickHomepageNavigate ? 'cursor-pointer hover:scale-105 transition-transform' : ''}`} onClick={onClickHomepageNavigate ? () => navigate('/') : undefined}>
            <img src={logo} alt="Payly Logo" className={`${className ? className : 'w-8 h-auto'}`} />
        </div>
    );
}

Logo.propTypes = {
    sideText: PropTypes.bool,
    className: PropTypes.string,
    textClassName: PropTypes.string,
    onClickHomepageNavigate: PropTypes.bool
}

export default Logo;