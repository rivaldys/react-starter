import { Layout } from '@/components'

const About = () =>
{
    return (
        <Layout>
            <h1 className="title">About</h1>
            <p>A React boilerplate with Atomic Design methodology. This boilerplate also includes libraries that support basic features such as <span className="highlight">fetching</span>, <span className="highlight">global state management</span>, and <span className="highlight">routing systems</span>. Built with the power of <span className="highlight-bg">React</span> and <span className="highlight-bg">Vite</span>.</p>
            <p>
                <span className="highlight">&gt; Main idea</span><br />
                The main idea of this boilerplate is to bundle things up that you need on starting a frontend project without manually configuring the routing library, fetching library, defining directory structure, etc.</p>
            <p>
                <span className="highlight">&gt; Then, in this boilerplate, what does the Atomic Design use for?</span><br />
                Atomic Design in design concept generally categorizes the component/element from the smallest to the biggest one (hence the name "atomic", adopted from physics term). 
                In frontend development or in programming in general, prioritizing the usage of components that can be reused again and again 
                (reusable components) is such a good idea for good development, programming experience, maintainability, etc. 
                In other words, this concept covers enough for that thing. This boilerplate implements the concept of Atomic Design in its directory structure.
            </p>

            <p className="paragraph-section">
                Edit <code>src/pages/About/index.jsx</code> and save to test HMR
            </p>
        </Layout>
    )
}

export default About