import UniverseCreateForm from "@/components/UniverseCreateForm";

export default function CreateUniverse() {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Create New Universe</h1>
      <UniverseCreateForm />
    </div>
  );
}