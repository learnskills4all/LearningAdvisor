import { useEffect, useRef, useState } from "react";
import { Checkbox, checkboxClasses, FormControl, MenuItem, Select, Theme } from "@mui/material";
import userType from "../../../../components/Sidebar/listUsersTypes";
import PageLayout from "../../../PageLayout";
import ButtonRegular from "../../../../components/ButtonRegular/ButtonRegular";
import Textfield from "../../../../components/Textfield/Textfield";
import INGTheme from "../../../../Theme";
import TextfieldEdit from "../../../../components/TextfieldEdit/TextfieldEdit";
import ImportTemplateLine from "../../../../components/ImportTemplateLine/ImportTemplateLine";
import API from "../../../../api/_API";
import { TemplateAPI } from "../../../../api/TemplateAPI/TemplateAPI";

/**
 * This is basically a page that is containing
 * the list of all existing templates
 * Important note:
 * This should only be accessible to admins
 */
function importTemplates ({ theme }: { theme: Theme }) {
    const [areaName, setAreaName] = useState("");

        useEffect(() => {
        getAllTemplates();
    });

    async function getAllTemplates() {
        try {
            const { data } = await API.get(`/template`);
            const checkBoxes = document.getElementById("checkboxes");

            if (checkBoxes == null) {return;}

            for (const template of data) {
                if(document.getElementById(template.template_name) != null) { continue; }

                const newCheckbox = document.createElement("input");
                newCheckbox.type = "checkbox";
                newCheckbox.id = template.template_name;
                newCheckbox.name = template.template_name;
                newCheckbox.value = template.template_id;

                const newLabel = document.createElement("label");
                newLabel.setAttribute("for",newCheckbox.name);
                newLabel.innerHTML = newCheckbox.name;

                checkBoxes.appendChild(newCheckbox);
                checkBoxes.appendChild(newLabel);
                checkBoxes.appendChild(document.createElement("br"));
            }
        } catch ( error ) {
            console.log(error);
        }
    }

    /**
     * return page with list of templates, e.g.:
     * individual templates, team templates
     */
    return (
        <div>
            <PageLayout title="Import Templates" sidebarType={userType.ADMIN}>
                <h2>Import a template from an Excel file</h2>

                <p>Please select which of the following existing templates should be included aswell</p>

                <div id="checkboxes" style={{alignSelf: "center", width :"100%"}}>
                    <input id="new" type="checkbox" name="newTemplate" value="0" onChange={inputOnChange}></input>
                    <label htmlFor="new">New Template</label>
                    <br/>
                </div>

                <div id="newTemplate" style={{display: "none", width: "100%"}}>
                    <p><br/>Select the type of tempalte<br/></p>
                    <select id="template-type-select" name="template-type" defaultValue={"INDIVIDUAL"}>
                        <option value="INDIVIDUAL">INDIVIDUAL</option>
                        <option value="TEAM">TEAM</option>
                    </select>
                    <p>Enter a name for the new template</p>
                    <textarea id="templateName"></textarea>
                </div>

                <ImportTemplateLine name="test"/>
            </PageLayout>
        </div>
    );
}


function inputOnChange() {
    var checkbox = document.getElementById("new") as HTMLInputElement;
    var newTemplateDiv = document.getElementById("newTemplate")

    if (newTemplateDiv == null) {return;}

    if (!checkbox.checked) { 
        newTemplateDiv.style.display = "none";
    } else {
        newTemplateDiv.style.display = "block";
    }
}


export default importTemplates;
