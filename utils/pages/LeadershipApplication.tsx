import { LeadershipApplicationForm } from '@/components/LeadershipApplicationForm';

const LeadershipApplication = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-secondary/30 py-16">
      <div className="container mx-auto px-4 max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Become a Community Leader
          </h1>
          <p className="text-lg text-muted-foreground">
            Help expand the Tariq Islam global community network in your area
          </p>
        </div>
        <LeadershipApplicationForm />
      </div>
    </div>
  );
};

export default LeadershipApplication;