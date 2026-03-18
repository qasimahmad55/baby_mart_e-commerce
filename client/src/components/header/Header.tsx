import React from 'react'
import TopHeader from './TopHeader'
import Container from '../common/Container'
import Logo from '../common/Logo'
import Searchinput from './Searchinput'
import OrdersIcon from './OrdersIcon'
import WishListIcon from './WishListIcon'
import UserButton from './UserButton'
import CartIcon from './CartIcon'

function Header() {
  return (
    <header className='border-b sticky top-0 z-50 bg-babyShopLightWhite'>
      <TopHeader />
      <Container className='flex items-center justify-between gap-10 py-4'>
        <div className='flex flex-1 items-center justify-between md:justify-start md:gap-12'>
          {/* sidebar */}
          <Logo />
          <div className='md:hidden flex items-center gap-3'>
            {/* order section */}
            {/* wishlist icon */}
            {/* cart icon */}
          </div>
          <Searchinput />
        </div>
        <div className='hidden md:inline-flex items-center gap-5'>
          <OrdersIcon />
          <WishListIcon />
          <UserButton />
          <CartIcon />
        </div>
      </Container>
    </header>
  )
}

export default Header