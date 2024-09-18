import { getI18n } from 'react-i18next';
import SvgColor from "../../components/svg-color";
import { Settings } from '@mui/icons-material';

const icon = (name) => (
	<SvgColor
		src={`/assets/icons/navbar/${name}.svg`}
		sx={{ width: 1, height: 1 }}
	/>
);

const getTranslatedText = (text) => {
	const i18n = getI18n();
	return i18n.t(text)
}

const navConfig = [
	// {
	// 	title: "dashboard",
	// 	path: "/",
	// 	icon: icon("ic_analytics"),
	// },
	{
		title: getTranslatedText("Dashboard"),
		path: "/dashboard",
		icon: icon("ic_houses"),
	},
	{
		title: "Settings",
		path: "/settings",
		icon: icon("ic_settings"),
	},
	// {
	// 	title: "Health Monitor",
	// 	path: "https://colab.research.google.com/drive/1SUue4SHjmgBZqUMnrEQ2CkoDWzwfDVQK?authuser=2",
	// 	icon: icon("ic_health"),
	// },
	
	// {
	// 	title: "user",
	// 	path: "/user",
	// 	icon: icon("ic_user"),
	// },
	// {
	// 	title: "product",
	// 	path: "/products",
	// 	icon: icon("ic_cart"),
	// },
	// {
	// 	title: "blog",
	// 	path: "/blog",
	// 	icon: icon("ic_blog"),
	// },
	// {
	// 	title: "login",
	// 	path: "/login",
	// 	icon: icon("ic_lock"),
	// },
	// {
	// 	title: "Not found",
	// 	path: "/404",
	// 	icon: icon("ic_disabled"),
	// },
];

export default navConfig;
