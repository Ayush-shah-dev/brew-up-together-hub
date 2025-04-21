
import Layout from "@/components/layout/Layout";
import ProfileForm from "@/components/profile/ProfileForm";

const CreateProfilePage = () => {
  return (
    <Layout>
      <div className="min-h-screen py-16 flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Complete Your Profile</h1>
          <p className="mt-2 text-gray-600">
            Help others learn more about you and find the right collaborations
          </p>
        </div>
        
        <div className="w-full max-w-3xl">
          <ProfileForm isEditing={false} />
        </div>
      </div>
    </Layout>
  );
};

export default CreateProfilePage;
