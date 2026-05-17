import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import PurposeSection from '../components/PurposeSection'
import WorkflowSection from '../components/WorkflowSection'
import FeaturesSection from '../components/FeaturesSection'
import InsightSection from '../components/InsightSection'

function LandingPage() {
  return (
    <main className="landing-page">
      <Header />
      <HeroSection />
      <PurposeSection />
      <WorkflowSection />
      <FeaturesSection />
      <InsightSection />
    </main>
  )
}

export default LandingPage