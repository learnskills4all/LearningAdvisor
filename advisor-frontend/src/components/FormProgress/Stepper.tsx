/*import * as React from 'react';
import Box from '@mui/material/Box';
import Stepper from '@mui/material/Stepper';
import Step from '@mui/material/Step';
import StepButton from '@mui/material/StepButton';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import ProgressCircle from '../FormProgress/ProgressCircle';



export default function HorizontalNonLinearStepper({
    steps,
    activeStep,
    handleNext,
    handleBack,
    handleStep,
    pad
  }: {
    steps: Array<string>;
    activeStep: number;
    handleNext: () => void;
    handleBack: () => void;
    handleStep: (i: number) => void;
    pad: (arg0: boolean) => void;
  }) {
  //const [activeStep, setActiveStep] = React.useState(0);
  const [completed, setCompleted] = React.useState<{
    [k: number]: boolean;
  }>({});

  const totalSteps = () => {
    return steps.length;
  };

  const completedSteps = () => {
    return Object.keys(completed).length;
  };

  const allStepsCompleted = () => {
    return completedSteps() === totalSteps();
  };

  const handleReset = () => {
    //setActiveStep(0);
    activeStep = 0;
    setCompleted({});
  };

  let notStickyStyles = { width: '1300px', pt: '4vh', pb: '4vh', display: "flex", justifyContent: "space-evenly" };
  let stickyStyles = { width: '1300px', pt: '4vh', pb: '4vh', display: "flex", justifyContent: "space-evenly", 
    position: 'fixed', top: 0, zIndex: 1, backgroundColor: '#EDE6E2' };
  const[styles, setStyles] = React.useState({});


  let navbar = {};
  React.useEffect(() => {
    setStyles(notStickyStyles);
    
    navbar = (document.getElementById('navbar') as HTMLInputElement);
    var sticky = (navbar as HTMLInputElement).offsetTop;

    console.log('Sticky: ' + sticky);
    const onScroll: EventListener = (event: Event) => { // <-- DOM-EventListener
        console.log('Scrolled!');

        if (window.pageYOffset >= sticky) { // If should be sticky
          //styles = { width: 'inherit', position: 'fixed', top: 0 }
          console.log('Sticky');
          setStyles(stickyStyles);
          console.log(styles);
          pad(true);
          console.log('Should pad!');
        } else {
          console.log('Not sticky');
          setStyles(notStickyStyles);
          console.log(styles);
          pad(false);
          console.log('Should not pad!');
        }

    };

    const win: Window = window;   // <-- DOM-Window, extends DOM-EventTarget
    win.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
}, []);

  return (
    <Box sx={styles} id={'navbar'}>
      <Box>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          sx={{ mr: 1 }}
        >
          Back
        </Button>
      </Box>
      <Stepper nonLinear activeStep={activeStep} alternativeLabel sx={{ width: '75%' }}>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepButton color="inherit" onClick={(e) => handleStep(index)}>
              {label}
            </StepButton>
          </Step>
        ))}
      </Stepper>
      <Box>
        <Button
          disabled={activeStep === steps.length - 1}
          onClick={handleNext}
          sx={{ mr: 1 }}
        >
          Next
        </Button>
      </Box>
    </Box>
  );
}*/

import * as React from 'react';
import CircularProgress from '@mui/material/CircularProgress';
import Typography from '@mui/material/Typography';
import Button from "@mui/material/Button";
import Box from '@mui/material/Box';
import { CategoryAPP } from '../../api/CategoryAPI/CategoryAPI';
import API from "../../api/_API";
import { AssessmentAPP } from '../../api/AssessmentAPI/AssessmentAPI';

// Circular progress
function CircularProgressWithLabel(
  props: { area: any | undefined, checkpointanswerlist: Record<number, number | undefined> | undefined, active: Boolean },
) {
  //console.log(props.checkpointanswerlist);
  const [answered, setAnswered] = React.useState<number>(0);
  const [total, setTotal] = React.useState<number>(0);

  // Set the currently answered questions for the area
  React.useEffect(()=>{
    let a = 0;

    if (props.area) {
      props.area.checkpoints.forEach((e: any) => {
        if (props.checkpointanswerlist) {
         if (e.checkpoint_id in props.checkpointanswerlist) {
          a++;
         }
       }
     });

     setAnswered(a);
    }
  }, [JSON.stringify(props.area), JSON.stringify(props.checkpointanswerlist)]);

  // Set the total questions for this area
  React.useEffect(()=>{
    if (props.area) {
      setTotal(props.area.questions);
    }
  }, [props.area]);
  return (
    <Box sx={{ position: 'relative' }}>
      <CircularProgress variant="determinate" value={100} thickness={props.active ? 4 : 1} sx={{
          position: 'absolute',
          right: 0,
          left: 0,
          margin: 'auto',
          color: '#ff9e9e'
        }}/>
      <CircularProgress variant="determinate" thickness={props.active ? 4 : 1} value={isNaN(answered / total) ? 0 : (answered / total) * 100}/>
      <Box
        sx={{
          top: -6,
          left: 0,
          bottom: 0,
          right: 0,
          position: 'absolute',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Typography
          variant="caption"
          component="div"
          color={props.active ? "text.secondary" : "text.primary"}
          sx={props.active ? {fontWeight: 'bold'} : {fontWeight: 'regular', fontSize: '8pt'}}
        >{`${ isNaN(answered / total) ? 0 : (answered / total) * 100 }%`}</Typography>
      </Box>
    </Box>
  );
}

export default function HorizontalNonLinearStepper({
  steps,
  activeStep,
  handleNext,
  handleBack,
  handleStep,
  pad,
  checkpointanswerlist,
  assessmentInfo
}: {
  steps: CategoryAPP[];
  activeStep: number;
  handleNext: () => void;
  handleBack: () => void;
  handleStep: (i: number) => void;
  pad: (arg0: boolean) => void;
  checkpointanswerlist: Record<number, number | undefined> | undefined,
  assessmentInfo: AssessmentAPP
}) {
  const [areaQuestions, setAreaQuestions] = React.useState<{id: number; questions: number}[]>([]);
  const [currentSteps, setCurrentSteps] = React.useState<Object[]>([]);
  const[styles, setStyles] = React.useState({});

  const notStickyStyles = { width: '1300px', paddingTop: '10px', paddingBottom: '10px'};
  const stickyStyles = { width: '1300px',paddingTop: '10px', paddingBottom: '10px', position: 'fixed', top: '-16px', zIndex: 1, backgroundColor: '#EDE6E2'};

  const [stepProgress, setStepProgress] = React.useState(-1); // -1: at beginning, 0: in the middle, 1: at the end

  // Get area questions
  React.useEffect(() => {
    if (steps) {
      const fetchData = async () => {
        var q = Array<Object>();

        for (const s of steps) {
          const { data } = await API.get(`/category/${s.id}/checkpoint`);
          //console.log(data);
          q.push({id: s.id, questions: data.length, checkpoints: data });
        }

        //console.log(q);
        setAreaQuestions(q as any);
      }

      fetchData()
        .catch(console.error);
    }
  }, [steps]);
  
  // Update the steps to be shown
  React.useEffect(()=>{
    if (steps) {
      if (activeStep < 2) { // if one of the first steps
        setCurrentSteps(steps.slice(0, 3));
        setStepProgress(-1);
      } else if (activeStep >= steps.length - 2) { // if one of the last 3 steps
        setCurrentSteps(steps.slice(steps.length - 3, steps.length));
        setStepProgress(1);
      } else { // if in the middle
        /*let a = steps.slice(activeStep - 1, activeStep + 2);
        a.push(steps[steps.length - 1]);
        a.unshift(steps[0]);*/
        setCurrentSteps(steps.slice(activeStep - 1, activeStep + 2));
        setStepProgress(0);
      }
    }
  }, [steps, activeStep]);

  // Control stepper stickiness
  let navbar = {};
  React.useEffect(() => {
    setStyles(notStickyStyles);
    pad(false);

    navbar = (document.getElementById('navbar') as HTMLInputElement);
    var sticky = (navbar as HTMLInputElement).offsetTop;

    console.log('Sticky: ' + sticky);
    const onScroll: EventListener = (event: Event) => { // <-- DOM-EventListener
        console.log('Scrolled!');

        if (window.pageYOffset >= sticky) { // If should be sticky
          console.log('Sticky');
          setStyles(stickyStyles);
          console.log(styles);
          pad(true);
          console.log('Should pad!');
        } else {
          console.log('Not sticky');
          setStyles(notStickyStyles);
          console.log(styles);
          pad(false);
          console.log('Should not pad!');
        }

    };

    const win: Window = window;   // <-- DOM-Window, extends DOM-EventTarget
    win.addEventListener("scroll", onScroll);

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div style={styles}>
      <ol className='c-stepper' id={'navbar'}>
        
        {(stepProgress == 0 || stepProgress == 1) && (
          <li>
            <Button variant="text" onClick={handleBack}>
              Back
            </Button>
          </li>
        )}

        {currentSteps.map((step, index) => (
            <li className={steps[activeStep] === step ? 'c-stepper__item__active' : 'c-stepper__item'} key={(step as any).id} onClick={(e) => handleStep(steps.indexOf(step as any))}>
              <CircularProgressWithLabel
                area={areaQuestions.find((e) => {return e.id === (step as any).id})}
                checkpointanswerlist={checkpointanswerlist}
                active={activeStep === steps.indexOf(step as any)}
              />
              <p>{(step as any).name}</p>
            </li>
        ))}

        {(stepProgress == 0 || stepProgress == -1) && (
          <li>
            <Button variant="text" onClick={handleNext}>
              Next
            </Button>
          </li>
        )}
      </ol>
    </div>
  );
}