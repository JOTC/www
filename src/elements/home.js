import React from "react";
import Sidebar from "./sidebar";
import Paper from 'material-ui/lib/paper';

module.exports = React.createClass({
  render() {
    return (
      <div className="home-container">
        <div className="random-image-container">
          <Paper zDepth={3} circle={true} style={{ overflow: "hidden" }}>
            <img src="http://lorempixel.com/400/400/animals/9"/>
          </Paper>
        </div>
        <div className="main">
          <h1 className="title">Welcome to JOTC</h1>

          The Jackson Obedience Training Club, Inc. (JOTC) is a non-profit
          organization established in 1969 and licensed by the American
          Kennel Club. The club is dedicated to the advancement of dog
          obedience as a sport and the promotion of responsible pet ownership.
          JOTC&apos;s belief is that any dog, purebred or mixed-breed, can learn
          basic obedience commands when taught with a consistent and positive
          approach.
          <br/><br/>
          JOTC sponsors obedience and rally trials, as well as offering
          training classes at various times throughout the year.
          <br/><br/>
          <h3>Why should you train your dog?</h3>
          <ul>
            <li>To have your dog under control and responsive to your commands. Wouldn&apos;t it be nice to call your dog and have him come running to you?</li>
            <li>To learn how to communicate with your dog so that he knows what you expect of him. This will make the dog&apos;s life happier and less stressful.</li>
            <li>Your dog&apos;s quick response to an obedience command could save his life. If your dog is about to rush into traffic or eat something deadly, you want him to understand and obey when you tell him to stop.</li>
            <li>You will build a better, stronger relationship with your dog through training.</li>
            <li>Your dog will learn to be polite and under control at all times, even in public, around other dogs, and with many distractions.</li>
            <li>Training your dog will reduce the risk of him biting someone, which could result in a lawsuit and even your dog being euthanized. A well-mannered, trained dog teamed with a responsible pet owner is absolutely necessary. Obedience training is a very subtle, non-threatening way of gaining control over a dog that is prone to aggression. Once your dog has been properly socialized and trained, the chances of him biting someone are significantly reduced.</li>
          </ul>
        </div>
      </div>
    );
  }
});
