from langflow.custom import Component
from langflow.inputs import StrInput, MultilineInput, SecretStrInput, IntInput, DropdownInput
from langflow.template import Output, Input
from langflow.schema.message import Message

class MyCustomComponent(Component):
    display_name = "My Custom Component"
    description = "An example of a custom component with various input types."

    inputs = [
         MessageTextInput(
            name="user",
            display_name="Select User",
            options=["hemanth", "pavan"],
            info="Select your User."
        ),
        MessageTextInput(
            name="password",
            display_name="Password",
            info="Enter your password."
        )
    ]

    outputs = [
        Output(display_name="Result", name="result", method="process_inputs"),
    ]

    def process_inputs(self) -> Message:
        passwordDict = {"hemanth":"Xenovus@123"}
        currentPassword = passwordDict.get(self.user)
        if currentPassword == self.password:
            message = Message(
            text=self.user,
        )
            return message
        else:
            return Message(
                text='NotFound'
            )
