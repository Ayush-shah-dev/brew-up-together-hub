
import Layout from "@/components/layout/Layout";
import ProjectForm from "@/components/project/ProjectForm";

const CreateProjectPage = () => {
  return (
    <Layout>
      <div className="min-h-screen py-16 flex flex-col items-center justify-center bg-gray-50">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Create New Project</h1>
          <p className="mt-2 text-gray-600">
            Share your project idea to find the perfect collaborators
          </p>
        </div>
        
        <div className="w-full max-w-3xl">
          <ProjectForm isEditing={false} />
        </div>
      </div>
    </Layout>
  );
};

export default CreateProjectPage;
