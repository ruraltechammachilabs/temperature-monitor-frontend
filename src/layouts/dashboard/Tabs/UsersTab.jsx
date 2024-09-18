/* MUI */
import { 
    Grid
} from "@mui/material"

/* Components */
import UsersView from "../../../sections/Users/UsersView"


const AlertUsersTab = () => {

  return (
    <>
        <Grid container spacing={2}>
            <Grid item xs={12}>
                <UsersView />
            </Grid>
        </Grid>
    </>
  )
}

export default AlertUsersTab