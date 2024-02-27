import React from 'react';
import Link from 'next/link';
import style from './page.module.css';

const HomePage: React.FC = () => {
  return (
    <div className={style.homePage}>
      {/* <h1>Welcome to My Application</h1>
      <p>This is the home page.</p>
      <Link href="/Lvl1">Lvl 1</Link><br/>
      <Link href="/Lvl2">Lvl 2</Link><br/> */}
      <div className={style.imgLink}><Link href="/Lvl1"><img src="/imgs/Lvl1-thumb.png"/></Link></div>
      <div className={style.imgLink}><Link href="/Lvl2"><img src="/imgs/Lvl2-thumb.png"/></Link></div>
    </div>
  );
};

export default HomePage;