import React, { useState, useContext } from "react";
import AuthLayout from "../../components/layout/AuthLayout";
import { ProfilePhotoSelector } from "../../components/ProfilePhotoSelector/ProfilePhotoSelector";
import { validateEmail } from "../../utils/helper";
import Input from "../../components/Input";
import { Link, useNavigate } from "react-router";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";
import { UserContext } from "../../context/userContext";
import { uploadImage } from "../../utils/uploadImage";

const Signup = () => {
  const [profilePic, setProfilePic] = useState(null);
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [adminInviteToken, setAdminInviteToken] = useState("");
  const [company, setCompany] = useState("");
  const [team, setTeam] = useState("");
  const [error, setError] = useState(null);
  const [signupAs, setSignupAs] = useState("member");

  const { updateUser } = useContext(UserContext);
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    setError("");

    try {
      if (signupAs === "company") {
        if (!company) {
          setError("Please enter your company name.");
          return;
        }

        // Register company using dedicated endpoint
        const response = await axiosInstance.post(API_PATHS.COMPANY.REGISTER, {
          name: company,
        });

        console.log(response.data);

        window.location.reload();
        return;
      }

      // Common user validations
      if (!fullName) {
        setError("Please enter your full name");
        return;
      }

      if (!validateEmail(email)) {
        setError("Please enter a valid email address.");
        return;
      }

      if (!password) {
        setError("Please enter the password");
        return;
      }

      if (!company) {
        setError("Please enter your company name.");
        return;
      }

      if (!team) {
        setError("Please enter your team name.");
        return;
      }

      let profileImageUrl = "";

      if (profilePic) {
        const imgUploadRes = await uploadImage(profilePic);
        profileImageUrl = imgUploadRes.imageUrl || "";
      }

      const payload = {
        name: fullName,
        email,
        password,
        profileImageUrl,
        company,
        team,
      };

      if (adminInviteToken) {
        payload.adminInviteToken = adminInviteToken;
      }

      const response = await axiosInstance.post(
        API_PATHS.AUTH.REGISTER,
        payload
      );

      const { token, role } = response.data;

      if (token) {
        localStorage.setItem("token", token);
        updateUser(response.data);

        if (role === "admin") {
          navigate("/admin/dashboard");
        } else {
          navigate("/user/dashboard");
        }
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Something went wrong. Please try again.");
      }
    }
  };

  return (
    <AuthLayout>
      <div className="lg:w-[100%] h-auto  md:h-full mt-10 md:mt-0 flex flex-col justify-center">
        <h3 className="text-xl font-semibold text-black">Create an Account</h3>
        <p className="text-xs text-slate-700 mt-[5px]">
          Join us today by entering your details today.
        </p>
        <div className="mt-2.5 mb-6 flex items-center gap-4">
          <p className="text-sm text-slate-700">SignUp as :</p>
          <div className="flex gap-6">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="signupAs"
                value="member"
                checked={signupAs === "member"}
                onChange={() => setSignupAs("member")}
                className="accent-primary"
              />
              Member
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="signupAs"
                value="admin"
                checked={signupAs === "admin"}
                onChange={() => setSignupAs("admin")}
                className="accent-primary"
              />
              Admin
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="radio"
                name="signupAs"
                value="company"
                checked={signupAs === "company"}
                onChange={() => setSignupAs("company")}
                className="accent-primary"
              />
              Company
            </label>
          </div>
        </div>

        <form onSubmit={handleSignup}>
          {signupAs === "company" ? (
            <></>
          ) : (
            <ProfilePhotoSelector image={profilePic} setImage={setProfilePic} />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {signupAs === "company" ? (
              <></>
            ) : (
              <>
                <Input
                  value={fullName}
                  onChange={({ target }) => setFullName(target.value)}
                  label="Full Name"
                  placeholder="John Doe"
                  type="text"
                />

                <Input
                  value={email}
                  onChange={({ target }) => setEmail(target.value)}
                  label="Email Address"
                  placeholder="john@example.com"
                  type="text"
                />

                {signupAs === "member" ? (
                  <div className="col-span-2">
                    <Input
                      value={password}
                      onChange={({ target }) => setPassword(target.value)}
                      label="Password"
                      placeholder="Min. 8 Characters"
                      type="password"
                    />
                  </div>
                ) : (
                  <Input
                    value={password}
                    onChange={({ target }) => setPassword(target.value)}
                    label="Password"
                    placeholder="Min. 8 Characters"
                    type="password"
                  />
                )}

                {signupAs === "admin" && (
                  <Input
                    value={adminInviteToken}
                    onChange={({ target }) => setAdminInviteToken(target.value)}
                    label="Admin Invite Token"
                    placeholder="6 Digit Code"
                    type="text"
                  />
                )}
              </>
            )}

            {signupAs === "company" ? (
              <div className="col-span-2">
                <Input
                  value={company}
                  onChange={({ target }) => setCompany(target.value)}
                  label="Company"
                  placeholder="Enter your company name"
                  type="text"
                />
              </div>
            ) : (
              <Input
                value={company}
                onChange={({ target }) => setCompany(target.value)}
                label="Company"
                placeholder="Enter your company name"
                type="text"
              />
            )}

            {signupAs === "company" ? (
              <></>
            ) : (
              <Input
                value={team}
                onChange={({ target }) => setTeam(target.value)}
                label="Team Name"
                placeholder="Enter your team name"
                type="text"
              />
            )}
          </div>

          {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

          <button type="submit" className="btn-primary">
            SIGNUP
          </button>

          <p className="text-[13px] text-slate-800 mt-3">
            Already have an account?{" "}
            <Link className="font-medium text-primary underline" to="/login">
              Login
            </Link>
          </p>
        </form>
      </div>
    </AuthLayout>
  );
};

export default Signup;
