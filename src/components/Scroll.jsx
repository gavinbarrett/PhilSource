import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export const Scroll = () => {
	const { pathname } = useLocation();
	useEffect(() => {
		// scroll to the top of the page
		window.scrollTo(0, 0);
	}, [pathname]);
	return null;
}
