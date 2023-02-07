import { render, cleanup, screen, fireEvent } from "@testing-library/react";
import { QueryClientProvider } from "react-query";
import Checkpoint from "../Checkpoint";
import client from "../../../app/client";
import Theme from "../../../Theme";

//  cleanup after each testcase
afterEach(cleanup);

//  a checkpoint consists of three radio buttons
//  checking rendering of the radio-buttons
//  checking clicking of the radio button in all possible sequences
//  initially no buttons are active
//  only one button can be clicked at the same time
it("The checkpoint renders and buttons are checked in sequences 123 132 213 231 321 and 312 with 1=Yes, 2=No and 3=N/A", () => {
  const { getByText } = render(
    <QueryClientProvider client={client}>
      <Checkpoint
        feedback={false}
        assessmentId={2}
        checkpointId={1}
        description="Checkpoint Description"
        number={1}
        theme={Theme}
        selectedAnswer="-"
        topicList={[]}
        setCheckpointAnswerList={undefined}
        setCurrentlyAnswered={() => undefined}
        answers={[
          { id: 1, label: "Yes", value: 1, templateId: 1, enabled: true },
          { id: 2, label: "No", value: 2, templateId: 1, enabled: true },
          { id: 3, label: "N/A", value: 3, templateId: 1, enabled: true },
        ]}
        topicIds={[]}
      />
    </QueryClientProvider>
  );
  expect(getByText("Checkpoint Description")).toBeInTheDocument();

  //  define three radio-buttons with labels Yes, No and N/A
  const radio1 = screen.getByLabelText("Yes");
  const radio2 = screen.getByLabelText("No");
  const radio3 = screen.getByLabelText("N/A");

  //  all buttons are off (initial state)
  function alloff() {
    expect(radio1).not.toBeChecked();
    expect(radio2).not.toBeChecked();
    expect(radio3).not.toBeChecked();
  }

  //  click on Yes
  //  result : only radio1 button is checked
  function clickradio1() {
    fireEvent.click(radio1);
    expect(radio1).toBeChecked();
    expect(radio2).not.toBeChecked();
    expect(radio3).not.toBeChecked();
  }

  //  click on No
  //  result : only radio2 button is checked
  function clickradio2() {
    fireEvent.click(radio2);
    expect(radio1).not.toBeChecked();
    expect(radio3).not.toBeChecked();
    expect(radio2).toBeChecked();
  }

  //  click on N/A
  //  result : only radio3 button is chalpineecked
  function clickradio3() {
    fireEvent.click(radio3);
    expect(radio1).not.toBeChecked();
    expect(radio2).not.toBeChecked();
    expect(radio3).toBeChecked();
  }
  //  all sequences are tested starting with the initial state
  alloff();
  clickradio2();
  clickradio3();
  clickradio1();
  clickradio3();
  clickradio2();
  clickradio1();
  clickradio3();
  clickradio2();
  clickradio3();
  clickradio1();
  clickradio3();
  clickradio2();
  clickradio1();
  clickradio3();
  clickradio1();
  clickradio2();
});
