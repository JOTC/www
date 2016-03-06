import React from "react";
import Sidebar from "./sidebar";
import Paper from 'material-ui/lib/paper';

module.exports = React.createClass({
  render() {
    return (
      <div className="classes-container">
        <div className="main">
          <h1 className="title">Obedience Classes</h1>
          <h2>Class Times and Locations</h2>
          JOTC currently offers classes four times a year:
          twice in the spring and twice in the fall. North
          classes are conducted through the city of
          Ridgeland and are held at the Old Trace Park on
          the Reservoir at Fowler Lodge. These classes
          usually begin the last Tuesday in March and the
          last Tuesday in August. South classes are currently
          being held at the old Home Depot location on Robinson
          Road in Jackson. These usually begin the first
          Thursday in April and the second Thursday in September.
          These classes last about an hour one night a week for
          6 weeks, including a graduation night.
          <br/><br/>
          For more information about JOTC classes, please call
          the Dog Line at <strong>(601) 352-DOGS (3647)</strong>.

          <h2>JOTC Classes</h2>
          <ul>
            <li>
              <strong>Puppy Manners</strong> (3-5 months of age):
              This class is specially tailored to a puppy&apos;s
              limited attention span. You learn how to teach basic
              obedience commands and receive tips on socialization,
              care, and raising a puppy.
            </li>

            <li>
              <strong>Basic Obedience</strong> (6 months and older):
              This class teaches basic obedience commands such as
              heel, sit, down, stay, come, and other commands that
              you will use in everyday life with your pet.
            </li>

            <li>
              <strong>CGC/Advanced</strong> (requires basic obedience):
              Builds on the basic obedience class and teaches the
              exercises necessary to obtain AKC&apos;s Canine Good
              Citizen (CGC) certification.
            </li>

            <li>
              <strong>Rally</strong> (requires basic obedience):
              Learn to run an obedience course with your dog.
            </li>
          </ul>

          <h2>General Information</h2>
          <ul>
            <li>
              Instructors for all classes are required to meet specific
              criteria, must hold at least one obedience title on a dog,
              and attend continuing education seminars and training.
            </li>
            <li>
              Pre-registration is requested for all classes in order to
              ensure proper class sizes.
            </li>
            <li>
              Proof of vaccination is required. Rabies vaccination must
              have been given by a licensed veterinarian.
            </li>
            <li>
              All Basic Obedience classes are divided according to dogs&apos;
              sizes. Classes include small, medium, and large dogs. This way,
              your small dog will not be intimidated by a larger dog, and
              your large dog won&apos;t be distracted by a smaller one.
            </li>
            <li>
              Our classes are small, usually with about 12 dogs per class.
              Each student will receive the individual attention necessary
              to help you fully understand each exercise as well as
              successfully work through any training problems you encounter.
            </li>
            <li>
              Obedience classes last six weeks and are held for one hour
              a night, one night a week. Rally classes last eight weeks.
            </li>
            <li>
              During class, you will be the one to train you dog, under
              the guidance of our instructors. We feel this approach is
              better for you and your dog than sending your dog to a
              boarding school to be trained by someone else for the
              following reasons:
              <ul>
                <li>
                  If your dog is trained by someone else, he will learn
                  to respond and respect them, but will still need to
                  learn to mind you. You will have to learn how to
                  communicate with your dog and enforce your commands
                  before the dog will take you seriously. The easiest
                  way to accomplish this is to learn what to do and
                  train the dog yourself.
                </li>
                <li>
                  Sending your dog to live with someone else for
                  several weeks or months is stressful for you and
                  your dog. Training with your dog is fun for both
                  of you.
                </li>
                <li>
                  If you are the one training your dog, you can be
                  assured that your dog is learning through a
                  consistent and positive approach.
                </li>
                <li>
                  Training builds a relationship between you and your
                  dog. You will find that you become closer and enjoy
                  your dog&apos;s company more when he is under control
                  and you can make him behave. If you send your dog to
                  be trained, you lose the bonding that comes with learning.
                </li>
                <li>
                  Training your dog in a group setting will give him the
                  opportunity to learn how to behave aground a number of
                  people and dogs. You will also learn how to read your dog.
                </li>
              </ul>
            </li>
            <li>
              JOTC welcomes all breeds of dogs to classes, regardless of
              whether the dog is a purebreed or mixed. <strong>HOWEVER,
              JOTC does not allow wolves or wolf hybrids in any of its
              classes.</strong>
            </li>
          </ul>
        </div>
      </div>
    );
  }
});
