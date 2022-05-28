import React from 'react'
import { ReactNavbar } from 'overlay-navbar';

const Header = () => {
    return (
        <>
            <ReactNavbar
                burgerColorHover='#9A8C98'
                // logo={logo}
                logoWidth='20vmax'
                navColor1='rgba(0,0,0,0.4)'
                logoHoverSize='10px'
                // logoHoverColor='#9A8C98'
                link1Text='Home'
                link2Text='About'
                link3Text='Product'
                link4Text='Contact'
                link1Url='/'
                link2Url='/about'
                link3Url='/product'
                link4Url='/contact'
                nav1justifyContent='flex-end'
                nav2justifyContent='flex-end'
                nav3justifyContent='flex-start'
                nav4justifyContent='flex-start'
                link1ColorHover='#22223B'
                link1Margin='1vmax'
                link1Size='2vmax'
                link1Color='#4A4E69'
                profileIconColor='white'
                searchIconColor='#4A4E69'
                cartIconColor='#4A4E69'
            />

        </>
    )
}

export default Header