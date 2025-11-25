import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, AlertTriangle, Users, MessageSquare, Heart, Ban } from 'lucide-react';
import { toast } from 'sonner';

const CommunityGuidelines = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);
  const [hasAccepted, setHasAccepted] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAcceptance();
  }, [user]);

  const checkAcceptance = async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    const { data } = await supabase
      .from('community_guidelines_acceptance')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (data) {
      setHasAccepted(true);
    }
    setLoading(false);
  };

  const handleAccept = async () => {
    if (!user) {
      toast.error('Please sign in to accept community guidelines');
      navigate('/auth');
      return;
    }

    if (!accepted) {
      toast.error('Please check the box to accept the guidelines');
      return;
    }

    try {
      const { error } = await supabase
        .from('community_guidelines_acceptance')
        .insert({
          user_id: user.id,
          version: '1.0',
          ip_address: null,
          user_agent: navigator.userAgent
        });

      if (error) throw error;

      toast.success('Guidelines accepted successfully');
      setHasAccepted(true);
      navigate('/');
    } catch (error) {
      console.error('Error accepting guidelines:', error);
      toast.error('Failed to accept guidelines');
    }
  };

  const guidelines = [
    {
      icon: Heart,
      title: 'Respect and Compassion',
      content: 'Treat all community members with kindness, respect, and compassion. Remember that behind every profile is a real person with feelings.',
      examples: [
        '✓ Engage in constructive discussions',
        '✓ Respect different interpretations and viewpoints',
        '✗ Personal attacks or insults',
        '✗ Harassment or bullying'
      ]
    },
    {
      icon: MessageSquare,
      title: 'Appropriate Content',
      content: 'Share content that is beneficial and appropriate for a Muslim community platform.',
      examples: [
        '✓ Islamic knowledge and resources',
        '✓ Community events and activities',
        '✗ Inappropriate images or videos',
        '✗ Spam or commercial solicitation'
      ]
    },
    {
      icon: Shield,
      title: 'Safety and Security',
      content: 'Help maintain a safe environment for all users by reporting suspicious or harmful content.',
      examples: [
        '✓ Report concerning content immediately',
        '✓ Protect your personal information',
        '✗ Share others\' private information',
        '✗ Attempt to circumvent security measures'
      ]
    },
    {
      icon: Ban,
      title: 'Zero Tolerance Policies',
      content: 'The following will result in immediate account suspension or permanent ban:',
      examples: [
        '✗ Extremist content or terrorism promotion',
        '✗ Hate speech against any group',
        '✗ Violence or threats of violence',
        '✗ Sexual harassment or exploitation',
        '✗ Child safety violations',
        '✗ Impersonation or fraud'
      ]
    },
    {
      icon: Users,
      title: 'Community Building',
      content: 'We are building a global Muslim community. Help us maintain a positive, supportive environment.',
      examples: [
        '✓ Welcome new members',
        '✓ Share beneficial knowledge',
        '✓ Organize positive events',
        '✗ Sectarian division or conflict'
      ]
    },
    {
      icon: AlertTriangle,
      title: 'Reporting System',
      content: 'If you see content that violates these guidelines, please report it using the report button.',
      examples: [
        'Reports are reviewed by our moderation team',
        'All reports are confidential',
        'False reports may result in penalties',
        'Serious violations are escalated immediately'
      ]
    }
  ];

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-muted-foreground">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <div className="container mx-auto max-w-4xl">
        <div className="text-center mb-8">
          <Shield className="w-16 h-16 mx-auto mb-4 text-islamic-green" />
          <h1 className="text-4xl font-bold mb-2">Community Guidelines</h1>
          <p className="text-lg text-muted-foreground">
            Building a Safe, Respectful Islamic Community
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Version 1.0 | Last Updated: {new Date().toLocaleDateString()}
          </p>
        </div>

        {hasAccepted && (
          <Card className="mb-6 border-islamic-green bg-islamic-green/5">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-islamic-green">
                <Shield className="w-5 h-5" />
                <p className="font-medium">You have accepted these guidelines</p>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="space-y-6 mb-8">
          {guidelines.map((guideline, index) => (
            <Card key={index}>
              <CardHeader>
                <div className="flex items-center gap-3">
                  <guideline.icon className="w-6 h-6 text-islamic-green" />
                  <CardTitle>{guideline.title}</CardTitle>
                </div>
                <CardDescription>{guideline.content}</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {guideline.examples.map((example, i) => (
                    <li key={i} className="text-sm text-muted-foreground flex items-start gap-2">
                      <span className="mt-1">{example.startsWith('✓') ? '✓' : example.startsWith('✗') ? '✗' : '•'}</span>
                      <span>{example.replace(/^[✓✗]\s*/, '')}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-muted/50">
          <CardHeader>
            <CardTitle>Enforcement and Appeals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Violations of these guidelines may result in:
            </p>
            <ul className="list-disc list-inside space-y-2 text-sm text-muted-foreground">
              <li>Warning and content removal (first offense)</li>
              <li>Temporary suspension (repeat offenses)</li>
              <li>Permanent ban (severe or repeated violations)</li>
            </ul>
            <p className="text-sm text-muted-foreground">
              If you believe moderation action was taken in error, you may appeal by contacting support.
            </p>
          </CardContent>
        </Card>

        {!hasAccepted && user && (
          <Card className="mt-8 border-islamic-green">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3 mb-4">
                <Checkbox 
                  id="accept" 
                  checked={accepted}
                  onCheckedChange={(checked) => setAccepted(checked as boolean)}
                />
                <label htmlFor="accept" className="text-sm cursor-pointer">
                  I have read and agree to follow the Tariq Islam Community Guidelines. 
                  I understand that violations may result in account suspension or termination.
                </label>
              </div>
              <Button 
                onClick={handleAccept} 
                className="w-full"
                disabled={!accepted}
              >
                Accept and Continue
              </Button>
            </CardContent>
          </Card>
        )}

        {!user && (
          <Card className="mt-8">
            <CardContent className="pt-6 text-center">
              <p className="mb-4">Please sign in to accept the community guidelines</p>
              <Button onClick={() => navigate('/auth')}>
                Sign In
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default CommunityGuidelines;
