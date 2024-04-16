import { useLocation, useNavigate } from "react-router-dom";

import { m } from "framer-motion";
import styles from "./Nav.module.scss";
import { useEffect } from "react";

const MAIN_NAVS = [
	{ string: "홈", to: "/" },
	{ string: "약 조회하기", to: "/search" },
	{ string: "명예의 전당", to: "#" },
	{ string: "근처 약국", to: "#" },
];

export default function Nav({
	toggleIsOpenNav,
}: {
	toggleIsOpenNav: () => void;
}) {
	const navigator = useNavigate();

	const location = useLocation();

	useEffect(() => {
		toggleIsOpenNav();
	}, [location, toggleIsOpenNav]);

	return (
		<m.nav
			onClick={toggleIsOpenNav}
			initial={{ opacity: 0, x: "100%" }}
			animate={{ opacity: 1, x: 0 }}
			exit={{ opacity: 0, x: "100%" }}
			transition={{ duration: 0.3 }}
		>
			<div className={styles["main-nav-container"]}>
				{MAIN_NAVS.map((navItem) => (
					<m.button
						key={navItem.string}
						className={styles["main-nav-item"]}
						onClick={() => {
							navigator(navItem.to);
						}}
						whileHover={{ scale: 1.1 }}
						whileTap={{ scale: 0.9 }}
					>
						{navItem.string}
					</m.button>
				))}
			</div>
			<div className={styles["divide"]} />
			<div className={styles["sub-nav-container"]}>
				<m.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
					로그인
				</m.button>
				<m.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
					회원가입
				</m.button>
			</div>
		</m.nav>
	);
}
