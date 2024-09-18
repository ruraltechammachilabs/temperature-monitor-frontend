import { useState } from "react";

/* MUI */
import {
	Grid,
	Modal,
	Card,
	CardContent,
	CardHeader,
	IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

/* Components */
import AlertUsersView from "../../../sections/alert-users/AlertUsersView";
import { useResponsive } from "../../../hooks/use-responsive";
import AddAlertUser from "../../../sections/alert-users/AddAlertUser";

const AlertUsersTab = () => {
	const mdDown = useResponsive("down", "md");

	/* Modal */
	const style = {
		position: "absolute",
		top: "50%",
		left: "50%",
		transform: "translate(-50%, -50%)",
		bgcolor: "background.paper",
		boxShadow: 24,
	};

	const [open, setOpen] = useState(false);

	const handleOpen = () => {
		setOpen(true);
	};
	const handleClose = () => {
		setOpen(false);
	};

	const handleModalClose = () => {
		setOpen(false);
	};

	return (
		<>
			<Grid container spacing={2}>
				<Grid item xs={12}>
					<AlertUsersView addAlertUserEvent={() => setOpen(true)} />
				</Grid>
			</Grid>

			{/* Add Alert User Modal */}

			<Modal
				open={open}
				onClose={handleClose}
				aria-labelledby="add-user-modal"
				aria-describedby="add-user-modal"
			>
				<Card
					sx={{
						minWidth: 50,
						borderRadius: 5,
						p: 3,
						width: mdDown ? "85%" : "30%",
						...style,
					}}
					className="custom-card"
				>
					<CardHeader
						sx={{ p: 0 }}
						action={
							<IconButton
								aria-label="close"
								color="secondary"
								onClick={handleModalClose}
							>
								<CloseIcon />
							</IconButton>
						}
					/>
					<CardContent
						sx={{
							display: "flex",
							justifyContent: "center",
							alignItems: "center",
							p: 0,
						}}
					>
						<AddAlertUser closeModal={() => setOpen(false)} />
					</CardContent>
				</Card>
			</Modal>
		</>
	);
};

export default AlertUsersTab;
