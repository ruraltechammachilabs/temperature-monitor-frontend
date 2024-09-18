import { fadeIn } from "./variants";
import { motion } from "framer-motion";

export const FadeIn = ({ children, direction, delay }) => {
	const variants = fadeIn(direction, delay);

	return (
		<motion.div variants={variants} initial="hidden" animate="show">
			{children}
		</motion.div>
	);
};

export default FadeIn;
