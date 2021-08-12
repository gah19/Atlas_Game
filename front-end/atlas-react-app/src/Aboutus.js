import {Component} from 'react'
import davidimg from './davidimg.jpg'
import joannaimg from './joannaimg.jpg'
import guyimg from './guyimg.jpg'
import michaelimg from './michaelimg.jpg'
import omidimg from './omidimg.jpeg'
import AboutMember from './AboutMember'

import './aboutus.css'

const memberDataObject = {
    david: {
        fullName: 'David Ingram',
        image: davidimg,
        description: "Doctoral (PhD) graduate in Physics from UCL. Big fan of Python (Pandas, NumPy, Matplotlib, Seaborn), full stack Javascript (HTML, CSS, React), data science/visualisation (SQL), and machine learning. I'm looking for an opportunity where I can use my technical and analytical expertise to help solve a variety of complex problems, as well as challenge myself to keep learning and developing new skills.",
        linkedIn: 'https://uk.linkedin.com/in/david-ingram-2984139b',
        github: 'https://github.com/Dingram23'
    },
    guy: {
        fullName: 'Guy Hotchin',
        image: guyimg,
        description: "After studying a masters degree in aeronautical engineering from Imperial College London I decided on a change of career into web based software development. This removed the physical bounds imposed by mechanical based engineering. Sigma labs has given me the opportunity to develop skills in Javascript, Html and Css which I look forward to applying on many future projects.",
        linkedIn: 'https://uk.linkedin.com/in/guy-hotchin-509742130',
        github: 'https://github.com/gah19'
    },
    joanna: {
        fullName: 'Joanna Hawthorne',
        image: joannaimg,
        description: "Hello! My name is Jo. I studied BA Japanese and Linguistics at SOAS, University of London. After graduating, I decided to take on coding as a hobby and immediately fell in love with it! I've studied JavaScript, HTML, CSS, SQL, and Data Science as part of the Sigma Labs Graduate Program, and am very much looking forward to a career in tech!",
        linkedIn: 'https://www.linkedin.com/in/joanna-hawthorne-9685921b1/',
        github: 'https://github.com/joannah62'
    },
    michael: {
        fullName: 'Michael Baugh',
        image: michaelimg,
        description: 'I am a recent BS Mathematics Graduate from the University of Bristol, who is always looking for opportunities to aid my personal development and up-skill. I love getting to the heart of complex problems and finding solutions. Since joining Sigma Labs I have loved coding everyday and learning new technologies and am looking forward to using these new skills in industry. In my spare time I enjoy playing chess and doing quizzes.' ,
        linkedIn: 'https://www.linkedin.com/in/michael-baugh-90126a4b/',
        github: 'https://github.com/mbaugh99'
    },
    omid: {
        fullName: 'Omid Wakili',
        image: omidimg,
        description: 'Hi, my name is Omid.I am a MSci Physics graduate from University College London with some work experience in the intellectual property sector, namely patents. I love learning about new science and technology! Since joining the Sigma Labs training programme, I have enjoyed the challenge of completing various coding projects. I love to learn new programming languages, environments and frameworks. Now, I am looking forward to my next challenge to allow me to develop my skills.',
        linkedIn: 'https://uk.linkedin.com/in/omid-wakili-34781b12a',
        github: 'https://github.com/quantumomid'
    },
}

export default class Aboutus extends Component{
    state={
        memberClicked: false,
        memberData: []
    }
    componentDidMount() {
        this.props.setInAboutusStatus()
      }

    handleClick(event){
        const { name } = event.target
        this.setState({
            memberClicked: true,
            memberData: memberDataObject[name]
        })
    }

    handleReset(){
        this.setState({memberClicked: false})
    }
    
    componentWillUnmount() {
        this.props.clearInAboutusStatus()
      }

    render(){
        const allMemberArticles = Object.keys(memberDataObject).map(member => {
            return (
                <article key={memberDataObject[member].fullName} className='container'>
                    <img name={member} src={memberDataObject[member].image} alt={"Headshot of " + memberDataObject[member].fullName} onClick={(event) => this.handleClick(event)}/>
                    <div>
                        <h3 className='name-tag'>{memberDataObject[member].fullName}</h3>
                    </div>
                </article>
            )})
            
        if(!this.state.memberClicked) {
            return (
                <div className='overall-container'>
                    <h1>Meet our team</h1>
                    <div className='whole-team-container'>
                        {allMemberArticles}
                    </div>
                </div>
            )
        } else{
            return (
                <AboutMember 
                    memberData={this.state.memberData}
                    handleReset={() => this.handleReset()}
                />
            )
        }
    }
}