import EditIcon from "@mui/icons-material/Edit";
import template from "../Images/template.png";
import { useRef, useState } from "react";
import ButtonRegular from "../ButtonRegular/ButtonRegular";
import TextfieldEdit from "../TextfieldEdit/TextfieldEdit";
import INGTheme from "../../Theme";
import { Button } from "@mui/material";
import readXlsxFile from "read-excel-file";
import { execFile } from "child_process";
import API from "../../api/_API";
import { CategoryAPI } from "../../api/CategoryAPI/CategoryAPI";
import { CheckpointAPI } from "../../api/CheckpointAPI/CheckpointAPI";
import { TopicAPI } from "../../api/TopicAPI/TopicAPI";
import { MaturityAPI } from "../../api/MaturityAPI/MaturityAPI";
import { AnswerAPI } from "../../api/AnswerAPI/AnswerAPI";

// List storing all the readywork lines
var readyWorkList = new Array<model>();
var listenerSet: boolean = false;

/**
 * function that returns a template card with
 * view, create and edit evaluation templates as bodytext,
 * templates as header text,
 * an "edit"-icon and an image on the left side
 * NOTE: this templatecard you will see in the administrator interface
 */
export default function ImportTemplateLine({ name }: { name: string })  {
    //const [text] = useState(name);
    const [areaName, setAreaName] = useState("");
    const inputFile = useRef<HTMLInputElement>(null);

      /*
    Create new template
  */
  async function importTemplate(templateType: string) {
    const { data } = await API.post(`/template`, {
       template_type: templateType,
     });
     console.log(data);
     return data.template_id;
  }


  async function updateTemplate(templateId: number, templateName: string) {
    const tp = {
      template_id: templateId,
      template_name: templateName
    }

    const { data } = await API.patch(`/template/${tp.template_id}`, tp);
  }


  async function importCategory(templateId: number, name: String) {
    const { data } = await API.post(`/template/${templateId}/category`);
    await changeCategory(data, name);
    return await data.category_id;
  }


  async function changeCategory(category: CategoryAPI, name: String) {
    const cg = {
      category_name: name,
    }

    const { data } = await API.patch(`/category/${category.category_id}`,cg);
  }


  async function importCheckPoint(categoryId: number, description: String, additionalInfo: String, weight: number, maturity: number, topics: number[]) {
    const { data } = await API.post(`/category/${categoryId}/checkpoint`);
    return await changeCheckPoint(data, description, additionalInfo, weight, maturity, topics);
  }

  async function changeCheckPoint(checkpoint: CheckpointAPI, description: String, additionalInfo: String, weight: number, maturity: number, topics: number[]) {
    const cp = {
      checkpoint_id: checkpoint.checkpoint_id,
      checkpoint_description: description,
      checkpoint_additional_information: additionalInfo,
      weight: weight,
      maturity_id: maturity,
      topics: topics,
    }

    const { data } = await API.patch(`/checkpoint/${cp.checkpoint_id}`, cp);
  }


  /*
    Create new topic
  */
  async function importTopic(templateId: number, name: String) {
    const { data } = await API.post(`/template/${templateId}/topic`);
    return await changeTopic(data, templateId, name);
  }


  /*
    Update the just created topic
  */
  async function changeTopic(topic: TopicAPI, templateId: number, name: String) {
    const tp = {
      topic_id: topic.topic_id,
      topic_name: name,
      template_id: templateId,
      disabled: false
    }

    const { data } = await API.patch(`/topic/${tp.topic_id}`, tp);
  }


  /*
    Create a new anwser
  */
  async function importAnswer(templateId: number, name: String, weight: number) {
    const { data } = await API.post(`/template/${templateId}/answer`);
    return await changeAnswer(data, templateId, name, weight);
  }


  /*
    Update the just created answer
  */
  async function changeAnswer(answer: AnswerAPI, templateId: number, name: String, weight: number) {
    const ans = {
      answer_id: answer.answer_id,
      answer_text: name,
      answer_weight: weight,
      template_id: templateId
    }

    const { data } = await API.patch(`/answer/${answer.answer_id}`, ans);
  }


  /*
    Create new maturity
  */
  async function importMaturity(templateId: number, name: String) {

    const { data } = await API.post(`/template/${templateId}/maturity`);
    return await changeMaturity(data, templateId, name);
  }


  async function getAllTopics(template_id: number) {
    const { data } = await API.get(`/template/${template_id}/topic`);
    var topics: [number, string][] = [];

    data.forEach((element: any) => {
      topics.push([element.topic_id, element.topic_name]);
    });

    return topics;
  }


  async function getAllMaturity(templateId: number) {
    const { data } = await API.get(`/template/${templateId}/maturity`);
    var maturities: [number, string][] = [];

    data.forEach((element: any) => {
      maturities.push([element.maturity_id, element.maturity_name]);
    });

    return maturities;
  }

  /*
    Update the just created maturity
  */
  async function changeMaturity(maturity: MaturityAPI, templateId: number, name: String) {
    const mp = {
      maturity_id: maturity.maturity_id,
      maturity_name: name,
      template_id: templateId,
      disabled: false
    } 

    const { data } = await API.patch(`/maturity/${mp.maturity_id}`, mp);
    return true;
  }


  async function getTopicIdsForNames(template_id: number, topics: String[]) {
    var topicList = await getAllTopics(template_id);
    var topicIds = [];

    for (const topicCombo of topicList) {
      if (topics.includes(topicCombo[1])) {
        topicIds.push(topicCombo[0]);
      }
    }

    console.log(topicIds);
    return topicIds;
  }


  async function getMaturityIdForName(template_id: number, maturity: String) {
    var maturityList = await getAllMaturity(template_id);
    for (const maturityCombo of maturityList) {
      if (maturityCombo[1] == maturity) {
        return maturityCombo[0];
      }
    }
    return null;
  }


  // Creating a new template
  async function createNeeded(areaName: string, templateName: string, templateType: string) {
    var template_id = await importTemplate(templateType)
    updateTemplate(template_id, templateName);
  
    await importAnswer(template_id, "Yes", 100);
    await importAnswer(template_id, "No", 0);

    var maturities = new Array();
    readyWorkList.forEach(element => {
      if(!maturities.includes(element.maturity)) { maturities.push(element.maturity) }
    })

    
    var topics = new Array();
    readyWorkList.forEach(element => {
      element.topic.split(",").forEach(function (topic) {
        topic = topic.trim();
        if(!topics.includes(topic)) { topics.push(topic) };
      })
    })

    const categoryId = await importCategory(template_id, areaName);
    
    if(maturities.length > 0) {   
      for (const item of maturities) {
        await importMaturity(template_id, item);
      }
    }
    
    if(topics.length > 0) {
      for (const topic of topics) {
        await importTopic(template_id, topic);
      }
    }

    for (const checkpoint of readyWorkList) {
      var maturityId = await getMaturityIdForName(template_id, checkpoint.maturity);

      if (maturityId == null) {
        console.log("no id for maturity found");
        return;
      }

      var topicIds = await getTopicIdsForNames(template_id, checkpoint.topic.split(",").map(element => element.trim()));
      await importCheckPoint(categoryId, checkpoint.CheckpointDescription, checkpoint.recommendations.toString(), checkpoint.weight, maturityId, topicIds);
    }
  }


  // Import area into template
  async function importArea(areaName: string, template_id: number) {  
    // Arrays to check for already existing maturities
    var maturityList = await getAllMaturity(template_id);
    var maturitiesExisting = new Array();
    var newMaturities = new Array();

    for (const maturityCombo of maturityList) {
      maturitiesExisting.push(maturityCombo[1]);
    }

    readyWorkList.forEach(element => {
      if(!maturitiesExisting.includes(element.maturity)) { newMaturities.push(element.maturity) }
    })

    // Arrays to check for already existing topics
    var topicList = await getAllTopics(template_id);
    var topicsExisting = new Array();
    var newTopcis = new Array();

    for (const topicCombo of topicList) {
      topicsExisting.push(topicCombo[1]);
    }
    
    readyWorkList.forEach(element => {
      element.topic.split(",").forEach(function (topic) {
        topic = topic.trim();
        if(!topicsExisting.includes(topic) && !newTopcis.includes(topic)) { 
          newTopcis.push(topic);
         }
      })
    })

    // Create new category
    const categoryId = await importCategory(template_id, areaName);
    
    // Create new maturities
    if(newMaturities.length > 0) {   
      for (const item of newMaturities) {
        await importMaturity(template_id, item);
      }
    }
    
    // Create new topics
    if(newTopcis.length > 0) {
      for (const topic of newTopcis) {
        await importTopic(template_id, topic);
      }
    }

    for (const checkpoint of readyWorkList) {
      var maturityId = await getMaturityIdForName(template_id, checkpoint.maturity);

      if (maturityId == null) {
        console.log("no id for maturity found");
        return;
      }

      var topicIds = await getTopicIdsForNames(template_id, checkpoint.topic.split(",").map(element => element.trim()));
      await importCheckPoint(categoryId, checkpoint.CheckpointDescription, checkpoint.recommendations.toString(), checkpoint.weight, maturityId, topicIds);
    }
  }



    return (
        <div style={{width: "100%", margin: "15px"}}>
            <h3 style={{height: "auto"}}>Enter a name for this area:</h3>
            <TextfieldEdit
                rows={1}
                theme={INGTheme}
                text={""}
                handleSave={(intermediateStringValue) => {
                        setAreaName(intermediateStringValue);
                    }
                }
            />
            <div style={{marginTop: "10px"}}>

                <Button
                    variant="contained"
                    color="primary"
                    style={{ fontWeight: "600", float: "left" }}
                    onClick={() => {
                        inputFile.current && inputFile.current.click();
                    }}
                >IMPORT FILE</Button>

                <input id="inputFile" type="file" onChange={inputOnChange} ref={inputFile} style={{display: "none"}}/>
                <p style={{float: "left", marginLeft: "10px", fontWeight: "600"}}>File name: </p><p id="fileName" style={{float: "left", marginLeft: "5px"}}></p>

                <Button
                    variant="contained"
                    color="primary"
                    style={{ fontWeight: "600", float: "right" }}
                    onClick={async () => {
                        if(areaName == "") {
                          confirm("no area name set!");
                          return;
                        }

                        const checkBoxes = document.getElementById("checkboxes");

                        if (checkBoxes == null) {
                          confirm("No checkboxes found!");
                          return;
                        }     

                        var inputs = checkBoxes.getElementsByTagName('input');

                        if (inputs == null) {
                          confirm("No checkboxes found!");
                          return;
                        }

                        for (var i = 0; i < inputs.length; i++) {
                          try {
                            if (!inputs[i].checked) { continue; }

                            if (inputs[i].value.toString() == "0") {
                              var templateTypeSelector = document.getElementById("template-type-select") as HTMLSelectElement;
                              var templateNameField = document.getElementById("templateName") as HTMLTextAreaElement;

                              if (templateTypeSelector == null) { continue;}
                              var templateType = templateTypeSelector.value;

                              if (templateNameField == null) {continue;}
                              var templateName = templateNameField.value;

                              await createNeeded(areaName, templateName, templateType);
                            } else {
                              await importArea(areaName, Number(inputs[i].value))
                            }

                            console.log(inputs[i]);
                            console.log(inputs[i].checked);
                          } catch (ex) {
                            console.log(ex);
                            confirm("Something went wrong for template " + inputs[i].name + ". Import was aborted for this template and is therefore not complete");
                          }
                        }
                        setAreaName("");
                        confirm("Area imported!");
                        //createNeeded(areaName);
                    }}
                >IMPORT INTO TEMPLATE</Button>
            </div>
        </div>
    );
}

function inputOnChange() {
    var input = document.getElementById("inputFile") as HTMLInputElement;

    if (input == null) { 
        console.log("Input does not exist");
        return; 
    }
    if (input.files == null || input.files.length <= 0) {
        console.log("file is empty");
        return; 
    }

    var file = input.files[0];
    var fileNameObject = document.getElementById("fileName");
    if (fileNameObject != null) {
        fileNameObject.innerText = file.name;
    }

    readyWorkList = new Array<model>();

    readXlsxFile(input.files[0]).then((rows) => {
        var i = 0;    
        try {
            // Skip the header row and continue with first element
            rows.slice(1).forEach(element => {
                try {
                // If there is no first element we do not add it but still check for recommendations
                if(element[0] != null) {
                    let maturity = element[0].toString() ?? "";
                    let checkpoint = element[1].toString() ?? "";
                    let weight: number = +element[2] ?? 0;
                    let topic = element[3].toString() ?? "";
                    let CheckpointDescription = element[4].toString() ?? "";
                    var recommendation: string;
                    if (element[5] == null ) {
                        recommendation = "";
                    } else {
                        recommendation = element[5].toString() ?? "";
                    }
            
                    // create the new ready work line
                    var line = new model(maturity, checkpoint, weight, topic, CheckpointDescription);
            
                    // Push the recommendation to the list
                    line.recommendations.push(recommendation);
            
                        // Populate the readywork lines array with the new line
                    readyWorkList.push(line)
                    i++;
                    // If no recommendation we do nothing
                } else if (element[5] != null) {
                    let recommendation = element[5].toString();
                    readyWorkList[i-1].recommendations.push(recommendation);
                }
                } catch (error) {
                    console.log(error);
                }
            });
        } catch (error) {
            console.log(error);
        }
        console.log(readyWorkList);
    });
}
 
// A class to store the model lines into
class model {
    maturity: String;
    checkpoint: String;
    weight: number;
    topic: String;
    CheckpointDescription: String;
    recommendations: Array<String> = new Array();
  
    constructor( maturity: String,checkpoint: String, weight: number,
    topic: String, checkpointDescription: String) {
        this.maturity = maturity;
        this.checkpoint = checkpoint;
        this.weight = weight;
        this.topic = topic;
        this.CheckpointDescription = checkpointDescription;
    }
}
