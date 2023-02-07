import { useRef } from "react";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import BarChartIcon from "@mui/icons-material/BarChart";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import GroupsIcon from "@mui/icons-material/Groups";
import EditIcon from "@mui/icons-material/Edit";
import BallotIcon from "@mui/icons-material/Ballot";
import PersonIcon from "@mui/icons-material/Person";
import PublishIcon from '@mui/icons-material/Publish';
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../../app/store";
import { resetUser } from "../../app/userDataSlice";
import { useLogout } from "../../api/LoginAPI/LoginAPI";
import ErrorPopup, { getOnError, RefObject } from "../ErrorPopup/ErrorPopup";
/**
 * define type called SidebarListProps,
 * which is a map for strings
 * to its corresponding boolean
 */
type SidebarListProps = {
  userType: Map<string, boolean>;
};
/**
 * export function sidebarlist that consists
 * of the userrole and the dispatch
 */
export default function SidebarList({ userType }: SidebarListProps) {
  const { userRole } = useSelector((state: RootState) => state.userData);
  const dispatch = useDispatch();

  /**
   * Ref for error popup
   */
  const refErrorItems = useRef<RefObject>(null);
  const onErrorItems = getOnError(refErrorItems);
  /**
   * declaration of constant logout
   */
  const logout = useLogout(onErrorItems);
  /**
   * return the sidebar containing the list names
   * home,
   * evaluation,
   * individluals,
   * teams,
   * templates,
   * and signout
   * From top to bottom
   * NOTE: users can't see the templates
   */
  return (
    <>
      {userType.get("home") && (
        <ListItemButton component={Link} to={`/${userRole}`}>
          <ListItemIcon>
            <HomeIcon color="info" />
          </ListItemIcon>
          <ListItemText primary="Home" style={{ color: "#fff" }} />
        </ListItemButton>
      )}
      {userType.get("evaluation") && (
        <ListItemButton component={Link} to="/user/self_evaluations">
          <ListItemIcon>
            <BarChartIcon color="info" />
          </ListItemIcon>
          <ListItemText primary="Evaluations" style={{ color: "#fff" }} />
        </ListItemButton>
      )}
      {userType.get("individuals") && (
        <ListItemButton component={Link} to="/admin/individuals">
          <ListItemIcon>
            <PersonIcon color="info" />
          </ListItemIcon>
          <ListItemText primary="Individuals" style={{ color: "#fff" }} />
        </ListItemButton>
      )}
      {userType.get("teams") && (
        <ListItemButton component={Link} to="/teams">
          <ListItemIcon>
            <GroupsIcon color="info" />
          </ListItemIcon>
          <ListItemText primary="Teams" style={{ color: "#fff" }} />
        </ListItemButton>
      )}
      {userType.get("template") && (
        <ListItemButton component={Link} to="/admin/templates">
          <ListItemIcon>
            <BallotIcon color="info" />
          </ListItemIcon>
          <ListItemText primary="Templates" style={{ color: "#fff" }} />
        </ListItemButton>
      )}
      {userType.get("template") && (
        <ListItemButton component={Link} to="/admin/templates/import">
          <ListItemIcon>
            <PublishIcon color="info" />
          </ListItemIcon>
          <ListItemText primary="Import Templates" style={{ color: "#fff" }} />
        </ListItemButton>
      )}
      {userType.get("changepassword") && (
        <ListItemButton component={Link} to="/changepassword">
          <ListItemIcon>
            <EditIcon color="info" />
          </ListItemIcon>
          <ListItemText primary="Change Password" style={{ color: "#fff" }} />
        </ListItemButton>
      )}
      {userType.get("signout") && (
        <ListItemButton
          component={Link}
          to="/"
          onClick={() => {
            logout.mutate();
            dispatch(resetUser());
          }}
        >
          <ListItemIcon>
            <LogoutIcon color="info" />
          </ListItemIcon>
          <ListItemText primary="Sign Out" style={{ color: "#fff" }} />
        </ListItemButton>
      )}
      <ErrorPopup ref={refErrorItems} />
    </>
  );
}
