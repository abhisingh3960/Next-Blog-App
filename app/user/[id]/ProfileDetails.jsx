"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Image from "next/image";
import moment from "moment";
import Modal from "@/components/Modal";
import { deletePhoto } from "@/actions/uploadActions";
import Input from "@/components/Input";
import demoImage from "@/public/img/john.avif";
import { AiOutlineClose } from "react-icons/ai";

const ProfileDetails = ({ profile, params }) => {
  const CLOUD_NAME = "dntnvdvsu";
  const UPLOAD_PRESET = "next_blog_images";

  const [profileToEdit, setProfileToEdit] = useState(profile);
  const [avatarToEdit, setAvatarToEdit] = useState("");

  const [openModalEdit, setOpenModalEdit] = useState(false);
  const [openModalDelete, setOpenModalDelete] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [isDeleting, setIsDeleting] = useState(false);

  const { data: session, status } = useSession();
  const router = useRouter();

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const { name, about, designation, age, location } = profileToEdit;

    if (!name) {
      setError("Name is required.");
      return;
    }

    if (avatarToEdit) {
      const maxSize = 2 * 1024 * 1024; // 2MB in bytes
      if (avatarToEdit.size > maxSize) {
        setError("File size is too large. Please select a file under 2MB.");
        return;
      }
    }

    try {
      setIsLoading(true);
      setError("");
      setSuccess("");

      let profileImg;

      if (avatarToEdit) {
        profileImg = await uploadImage();

        if (profile?.avatar?.id) {
          await deletePhoto(profile?.avatar?.id);
        }
      } else {
        profileImg = profile?.avatar;
      }

      const updateUser = {
        name,
        about,
        designation,
        age,
        location,
        avatar: profileImg,
      };

      const response = await fetch(
        `http://localhost:3000/api/user/${params.id}`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session?.user?.accessToken}`,
          },
          method: "PATCH",
          body: JSON.stringify(updateUser),
        }
      );

      if (response?.status === 200) {
        setSuccess("User updated successfully.");
      } else {
        setError("Error occurred while updating user.");
      }
    } catch (error) {
      console.log(error);
      setError("Error occurred while updating user.");
    } finally {
      setSuccess("");
      setError("");
      setIsLoading(false);
      setOpenModalEdit(false);
      setAvatarToEdit("");
      router.refresh();
    }
  };

  const uploadImage = async () => {
    if (!avatarToEdit) return;

    const formdata = new FormData();

    formdata.append("file", avatarToEdit);
    formdata.append("upload_preset", UPLOAD_PRESET);

    try {
      const res = await fetch(
        `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
        {
          method: "POST",
          body: formdata,
        }
      );

      const data = await res.json();
      const image = {
        id: data["public_id"],
        url: data["secure_url"],
      };

      return image;
    } catch (error) {
      console.log(error);
    }
  };

  const timeFormat = () => {
    const timeStr = profile?.createdAt;
    const time = moment(timeStr);
    const formattedTime = time.format("MMMM Do YYYY");

    return formattedTime;
  };

  const handleCancleUploadImage = () => {
    setAvatarToEdit("");
  };

  const handleChange = (event) => {
    setError("");
    const { name, value, type, files } = event.target;

    if (type === "file") {
      setAvatarToEdit(files[0]);
    } else {
      setProfileToEdit((preState) => ({ ...preState, [name]: value }));
    }
  };

  if (!profile) {
    return <p>Access Denied.</p>;
  }

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto">
  <div className="text-center text-primaryColor mb-10">
    <h2 className="text-3xl font-semibold">Profile</h2>
  </div>

  <div className="flex flex-col md:flex-row gap-10">
    {/* About Me Section */}
    <div className="flex-1 space-y-3">
      <h4 className="text-2xl font-medium">About Me</h4>
      <p className="text-gray-700">{profile?.about}</p>
    </div>

    {/* Avatar Section */}
    <div className="flex-1 flex items-center justify-center">
      <Image
        src={profile?.avatar?.url || demoImage}
        alt="avatar"
        width={160}
        height={160}
        className="rounded-full border-2 border-black object-cover w-40 h-40"
      />
    </div>

    {/* Details Section */}
    <div className="flex-1 space-y-3">
      <h4 className="text-2xl font-medium">Details</h4>

      {[
        { label: "Email", value: profile?.email },
        { label: "Name", value: profile?.name },
        { label: "Age", value: profile?.age },
        { label: "Location", value: profile?.location },
        { label: "Joined", value: timeFormat() },
      ].map(({ label, value }) => (
        <div key={label}>
          <p className="text-sm text-gray-500">{label}:</p>
          <p className="font-medium">{value}</p>
        </div>
      ))}
    </div>
  </div>

  {/* Edit Button */}
  {profile?._id === session?.user?._id && (
    <div className="mt-6">
      <button
        className="bg-blue-600 px-3 py-2 rounded-md text-white cursor-pointer tarnsition-all duration-300 hover:bg-blue-700  font-medium"
        onClick={() => setOpenModalEdit(true)}
      >
        Edit Profile
      </button>
    </div>
  )}

  {/* Modal */}
  <Modal modalOpen={openModalEdit} setModalOpen={setOpenModalEdit}>
    <form className="space-y-5" onSubmit={handleEditSubmit}>
      <h2 className="text-2xl font-bold text-blue-600 mb-3">Edit Profile</h2>

      {/* Avatar Preview */}
      {avatarToEdit ? (
        <div className="flex items-center gap-3">
          <Image
            src={URL.createObjectURL(avatarToEdit)}
            alt="avatar"
            width={80}
            height={80}
            className="rounded-full border-2 border-black object-cover w-20 h-20"
          />
          <button
            type="button"
            className="text-red-500"
            onClick={handleCancleUploadImage}
          >
            <AiOutlineClose size={20} />
          </button>
        </div>
      ) : (
        profile?.avatar?.url && (
          <div className="flex justify-center">
            <Image
              src={profile.avatar.url}
              alt="avatar"
              width={80}
              height={80}
              className="rounded-full border-2 border-black object-cover w-20 h-20"
            />
          </div>
        )
      )}

      <input
        onChange={handleChange}
        type="file"
        name="newImage"
        accept="image/*"
        className="block w-full px-3 py-2 border border-gray-300 rounded-md file:mr-4 file:py-1 file:px-4 file:border-0 file:text-sm file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
      />

      {/* Form Inputs */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input name="name" type="text" placeholder="Name" value={profileToEdit.name || ""} onChange={handleChange} />
        <Input name="designation" type="text" placeholder="Designation" value={profileToEdit.designation || ""} onChange={handleChange} />
        <Input name="about" type="text" placeholder="About" value={profileToEdit.about || ""} onChange={handleChange} />
        <Input name="age" type="text" placeholder="Age" value={profileToEdit.age || ""} onChange={handleChange} />
        <Input name="location" type="text" placeholder="Location" value={profileToEdit.location || ""} onChange={handleChange} />
      </div>

      {/* Alerts */}
      {error && <p className="text-red-600 font-medium">{error}</p>}
      {success && <p className="text-green-600 font-medium">{success}</p>}

      <div className="flex gap-4 pt-2">
        <button
          type="submit"
          className="bg-blue-600 hover:bg-blue-700 transition-all duration-300 text-white px-4 py-2 rounded hover:bg-opacity-90"
        >
          {isLoading ? "Loading..." : "Update"}
        </button>
        <button
          type="button"
          className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400"
          onClick={() => setOpenModalEdit(false)}
        >
          Cancel
        </button>
      </div>
    </form>
  </Modal>
</div>

  );
};

export default ProfileDetails;
