import { Fragment, useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";
import {
  Dialog,
  DialogBody,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { useAuthContext } from "../../../../auth/useAuthContext"; 
import { Alert } from "@/components";
import { useLayout } from "@/providers";
import axios from "axios";
import { DialogClose } from "@radix-ui/react-dialog";

interface IModalPersonProps {
  open: boolean;
  onOpenChange: () => void;
}

const initialValues = {
  id: 0,
  first_name: "",
  last_name: "",
  mobile: "",
  email: "",
  gst: "",
  person_type: ""
};

const savePersonSchema = Yup.object().shape({
  first_name: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("First Name is required"),
  last_name: Yup.string()
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Last Name is required"),
  mobile: Yup.string()
    .min(10, "Minimum 10 symbols")
    .max(13, "Maximum 13 symbols")
    .required("Last Name is required"),
  email: Yup.string()
    .email("Wrong email format")
    .min(3, "Minimum 3 symbols")
    .max(50, "Maximum 50 symbols")
    .required("Email is required"),
  gst: Yup.string()
    .min(15, "Minimum 15 symbols")
    .max(15, "Maximum 15 symbols"),
  person_type: Yup.string() 
    .required("Person Type is required")
});


const ModalPerson = ({ open, onOpenChange }: IModalPersonProps) => {

  const [loading, setLoading] = useState(false);
  const { register } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/";
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { currentLayout } = useLayout();

  const formik = useFormik({
    initialValues,
    validationSchema: savePersonSchema,
    onSubmit: async (values, { setStatus, setSubmitting }) => {
      setLoading(true);
      try {
        const postData : any = {
          first_name: values.first_name,
          last_name: values.last_name,
          mobile: values.mobile,
          email: values.email,
          gst: values.gst,
          person_type: values.person_type,
        };
        const apiUrl = "http://127.0.0.1:5000/persons/"
        const response = await axios.post(`${apiUrl}`, postData);
        navigate(from, { replace: true });
      } catch (error) {
        console.error(error);
        setStatus("The person details are incorrect");
        setSubmitting(false);
        setLoading(false);
      }
    }
  });


  return (
    <Fragment>
      <div className="max-w-[auto] w-full">
            <form
              className="flex flex-col gap-5 p-10"
              noValidate
              onSubmit={formik.handleSubmit}
            >
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="container-fixed max-w-[600px] p-0 [&>button]:hidden">
          <DialogHeader className="modal-header">
            <DialogTitle className="modal-title">Person</DialogTitle>
            <DialogDescription></DialogDescription>
            <DialogClose></DialogClose>
          </DialogHeader>
          <DialogBody className="modal-body">
              {formik.status && <Alert variant="danger">{formik.status}</Alert>}
              <div className="flex flex-col gap-1">
                <label className="form-label text-gray-900">First Name</label>
                <label className="input">
                  <input
                    placeholder="first name"
                    type="input"
                    autoComplete="off"
                    {...formik.getFieldProps("first_name")}
                    className={clsx(
                      "form-control bg-transparent",
                      { "is-invalid": formik.touched.first_name && formik.errors.first_name },
                      {
                        "is-valid": formik.touched.first_name && !formik.errors.first_name
                      }
                    )}
                  />
                </label>
                {formik.touched.first_name && formik.errors.first_name && (
                  <span role="alert" className="text-danger text-xs mt-1">
                    {formik.errors.first_name}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="form-label text-gray-900">Last Name</label>
                <label className="input">
                  <input
                    placeholder="last name"
                    type="input"
                    autoComplete="off"
                    {...formik.getFieldProps("last_name")}
                    className={clsx(
                      "form-control bg-transparent",
                      { "is-invalid": formik.touched.last_name && formik.errors.last_name },
                      {
                        "is-valid": formik.touched.last_name && !formik.errors.last_name
                      }
                    )}
                  />
                </label>
                {formik.touched.last_name && formik.errors.last_name && (
                  <span role="alert" className="text-danger text-xs mt-1">
                    {formik.errors.last_name}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="form-label text-gray-900">Mobile</label>
                <label className="input">
                  <input
                    placeholder="mobile"
                    type="input"
                    autoComplete="off"
                    {...formik.getFieldProps("lastmobile_name")}
                    className={clsx(
                      "form-control bg-transparent",
                      { "is-invalid": formik.touched.mobile && formik.errors.mobile },
                      {
                        "is-valid": formik.touched.mobile && !formik.errors.mobile
                      }
                    )}
                  />
                </label>
                {formik.touched.mobile && formik.errors.mobile && (
                  <span role="alert" className="text-danger text-xs mt-1">
                    {formik.errors.mobile}
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-1">
                <label className="form-label text-gray-900">Email</label>
                <label className="input">
                  <input
                    placeholder="email@email.com"
                    type="email"
                    autoComplete="off"
                    {...formik.getFieldProps("email")}
                    className={clsx(
                      "form-control bg-transparent",
                      { "is-invalid": formik.touched.email && formik.errors.email },
                      {
                        "is-valid": formik.touched.email && !formik.errors.email
                      }
                    )}
                  />
                </label>
                {formik.touched.email && formik.errors.email && (
                  <span role="alert" className="text-danger text-xs mt-1">
                    {formik.errors.email}
                  </span>
                )}
              </div>

              <div className="flex flex-col gap-1">
                <label className="form-label text-gray-900">GST</label>
                <label className="input">
                  <input
                    type="text"
                    placeholder="GST"
                    autoComplete="off"
                    {...formik.getFieldProps("gst")}
                    className={clsx(
                      "form-control bg-transparent",
                      {
                        "is-invalid": formik.touched.gst && formik.errors.gst
                      },
                      {
                        "is-valid": formik.touched.gst && !formik.errors.gst
                      }
                    )}
                  />
                </label>
                {formik.touched.gst && formik.errors.gst && (
                  <span role="alert" className="text-danger text-xs mt-1">
                    {formik.errors.gst}
                  </span>
                )}
              </div> 
              <div className="flex flex-col gap-1">
                <label className="form-label text-gray-900">Person Type</label>
                <label className="select">
                  
                  <input
                    type="text"
                    placeholder="GST"
                    autoComplete="off"
                    {...formik.getFieldProps("gst")}
                    className={clsx(
                      "form-control bg-transparent",
                      {
                        "is-invalid": formik.touched.gst && formik.errors.gst
                      },
                      {
                        "is-valid": formik.touched.gst && !formik.errors.gst
                      }
                    )}
                  />
                </label>
                {formik.touched.gst && formik.errors.gst && (
                  <span role="alert" className="text-danger text-xs mt-1">
                    {formik.errors.gst}
                  </span>
                )}
              </div> 
          </DialogBody>
          <DialogFooter>
          <button
                type="submit"
                className="btn btn-primary flex right"
                disabled={loading || formik.isSubmitting}
              >
                {loading ? "Please wait..." : "Save"}
              </button> 
          </DialogFooter>
        </DialogContent>
      </Dialog>
      </form>
    </div>
    </Fragment>
  );
};

export { ModalPerson };