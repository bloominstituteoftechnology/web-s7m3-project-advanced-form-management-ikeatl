// ❗ The ✨ TASKS inside this component are NOT IN ORDER.
// ❗ Check the README for the appropriate sequence to follow.
import React, { useState, useEffect } from 'react'
import * as yup from "yup";
import axios from 'axios';

const e = { // This is a dictionary of validation error messages.
  // username
  usernameRequired: 'username is required',
  usernameMin: 'username must be at least 3 characters',
  usernameMax: 'username cannot exceed 20 characters',
  // favLanguage
  favLanguageRequired: 'favLanguage is required',
  favLanguageOptions: 'favLanguage must be either javascript or rust',
  // favFood
  favFoodRequired: 'favFood is required',
  favFoodOptions: 'favFood must be either broccoli, spaghetti or pizza',
  // agreement
  agreementRequired: 'agreement is required',
  agreementOptions: 'agreement must be accepted',
}

// ✨ TASK: BUILD YOUR FORM SCHEMA HERE
// The schema should use the error messages contained in the object above.

export default function App() {
  // ✨ TASK: BUILD YOUR STATES HERE
  // You will need states to track (1) the form, (2) the validation errors,
  // (3) whether submit is disabled, (4) the success message from the server,
  // and (5) the failure message from the server.
  const initialFormErrors = { username: "", favLanguage: '', favFood: "", agreement: false }
  const initialFormValues = { username: "", favLanguage: '', favFood: "", agreement: false }
  const [formValues, setFormValues] = useState(initialFormValues);
  const [formErrors, setFormErrors] = useState(initialFormErrors);
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [successMessage, setSuccessMessage] = useState("");
  const [failureMessage, setFailureMessage] = useState("");


  // ✨ TASK: BUILD YOUR EFFECT HERE
  // Whenever the state of the form changes, validate it against the schema
  // and update the state that tracks whether the form is submittable.
  const schema = yup.object().shape({
    username: yup
      .string()
      .trim()
      .required(e.usernameRequired)
      .min(3, e.usernameMin)
      .max(20, e.usernameMax),
    favLanguage: yup
      .string()
      .oneOf(['javascript', 'rust'], e.favLanguageRequired, e.favLanguageOptions),
    favFood: yup
      .string()
      .oneOf(["pizza", "spaghetti", "broccoli"], e.favFoodRequired, e.favFoodOptions),
    agreement: yup
      .boolean()
      .required(e.agreementOptions, e.agreementRequired)
      .oneOf([true], e.agreementOptions)
  })

  useEffect(() => {
    console.log('$'.repeat(22));
    console.log("formValues:", formValues);
    schema.isValid(formValues).then(valid => setSubmitDisabled(!valid))
  }, [formValues])

  // ✨ TASK: IMPLEMENT YOUR INPUT CHANGE HANDLER
  // The logic is a bit different for the checkbox, but you can check
  // whether the type of event target is "checkbox" and act accordingly.
  // At every change, you should validate the updated value and send the validation
  // error to the state where we track frontend validation errors.

  const inputChange = (name, value) => {
    validate(name, value);
    setFormValues({
      ...formValues, [name]: value
    })

  }


  const validate = (name, value) => {
    yup.reach(schema, name)
      .validate(value)
      .then(() => setFormErrors({ ...formErrors, [name]: "" }))
      .catch(err => setFormErrors({ ...formErrors, [name]: err.errors[0] }))
  }

  const onChange = evt => {
    const { name, value, checked, type } = evt.target
    const valueToUse = type === "checkbox" ? checked : value
    inputChange(name, valueToUse)
  }

  const onSubmit = evt => {
    console.log('>'.repeat(33));
    console.log("evt:", evt);
    // ✨ TASK: IMPLEMENT YOUR SUBMIT HANDLER
    // Lots to do here! Prevent default behavior, disable the form to avoid
    // double submits, and POST the form data to the endpoint. On success, reset
    // the form. You must put the success and failure messages from the server
    // in the states you have reserved for them, and the form
    // should be re-enabled.
    evt.preventDefault();
    setSubmitDisabled(true);
    axios.post("https://webapis.bloomtechdev.com/registration", formValues)
      .then(res => {
        console.log(res.data)
        setSuccessMessage(res.data.message);
      })
      .catch(err => {
        console.error(err)
        setFailureMessage("Sorry! Username is taken");
      })
      .finally(() => {
        console.log('#'.repeat(22));
        setFormValues(initialFormValues)
        // setSubmitDisabled(false)
      })
  }

  return (
    <div> {/* TASK: COMPLETE THE JSX */}
      <h2>Create an Account</h2>
      <form onSubmit={onSubmit} >
        {successMessage && <h4 className="success">{successMessage}</h4>}
        {failureMessage && <h4 className="error">{failureMessage}</h4>}

        <div className="inputGroup">
          <label htmlFor="username">Username:</label>
          <input id="username" name="username" type="text" value={formValues.username} placeholder="Type Username" onChange={onChange} />
          {formErrors.username && <div className="validation">{formErrors.username}</div>}
        </div>

        <div className="inputGroup">
          <fieldset>
            <legend>Favorite Language:</legend>
            <label>
              <input type="radio" name="favLanguage" value="javascript" onChange={onChange} checked={formValues.favLanguage === "javascript"} />
              JavaScript
            </label>
            <label>
              <input type="radio" name="favLanguage" value="rust" onChange={onChange} checked={formValues.favLanguage === "rust"} />
              Rust
            </label>
          </fieldset>
          {formErrors.favLanguage && <div className="validation">{formErrors.favLanguage}</div>}
        </div>

        <div className="inputGroup">
          <label htmlFor="favFood">Favorite Food:</label>
          <select id="favFood" name="favFood" onChange={onChange} value={formValues.favFood} >
            <option value="">-- Select Favorite Food --</option>
            <option value="pizza">Pizza</option>
            <option value="spaghetti">Spaghetti</option>
            <option value="broccoli">Broccoli</option>
          </select>
          {formErrors.favFood && <div className="validation">{formErrors.favFood}</div>}
        </div>

        <div className="inputGroup">
          <label>
            <input id="agreement" type="checkbox" name="agreement" onChange={onChange} checked={formValues.agreement} />
            Agree to our terms
          </label>
          {formErrors.agreement && <div className="validation">{formErrors.agreement}</div>}
        </div>

        <div>
          <input type="submit" disabled={submitDisabled} />
        </div>
      </form>
    </div>
  )
}
