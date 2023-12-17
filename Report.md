Assignment 6
---------------------

# Team Members

- Teo Field-Marsham
- Nicolas Keller

# GitHub link to your (forked) repository

https://github.com/TeoField-Marsham/Assignment6

# Task 1

1. WebIDs of the group members

Ans: https://solid.interactions.ics.unisg.ch/teofieldmarsham/profile/card#me
     https://solid.interactions.ics.unisg.ch/nicokeller1/profile/card#me


2. Group profile

Ans: https://solid.interactions.ics.unisg.ch/teofieldmarsham/group-members.ttl




# Task 2

1. What command did you perform to get the group name from the WebId?

Ans: nicolaskeller@Air-de-Nicolas Assignment6 % comunica-sparql "https://solid.interactions.ics.unisg.ch/nicokeller1/profile/card" "PREFIX foaf: <http://xmlns.com/foaf/0.1/> SELECT ?group WHERE { <https://solid.interactions.ics.unisg.ch/nicokeller1/profile/card#me> foaf:member ?group . }"

(node:45448) [DEP0040] DeprecationWarning: The punycode module is deprecated. Please use a userland alternative instead.
(Use node --trace-deprecation ... to show where the warning was created)
[
{"group":"https://solid.interactions.ics.unisg.ch/teofieldmarsham/group-members.ttl"}
]


2. Which command did you perform to get the group members from the WebId?

Ans: nicolaskeller@eduroamstud-10-255-150-208 Assignment6 % comunica-sparql-link-traversal "https://solid.interactions.ics.unisg.ch/teofieldmarsham/group-members.ttl" "PREFIX foaf: <http://xmlns.com/foaf/0.1/> SELECT ?member WHERE { <https://solid.interactions.ics.unisg.ch/teofieldmarsham/group-members.ttl> foaf:member ?member . }"
(node:47612) [DEP0040] DeprecationWarning: The punycode module is deprecated. Please use a userland alternative instead.
(Use node --trace-deprecation ... to show where the warning was created)
[
{"member":"https://solid.interactions.ics.unisg.ch/teofieldmarsham/profile/card#me"},
{"member":"https://solid.interactions.ics.unisg.ch/nicokeller1/profile/card#me"},
{"member":"https://solid.interactions.ics.unisg.ch/nicokeller1/profile/card#me"},
{"member":"https://solid.interactions.ics.unisg.ch/teofieldmarsham/profile/card#me"}
]


3. Which command did you performed to get the group members from the WebId without link traversal? Which result did you get? Is it correct?

Ans: nicolaskeller@eduroamstud-10-255-150-208 Assignment6 % comunica-sparql "https://solid.interactions.ics.unisg.ch/teofieldmarsham/group-members.ttl" "PREFIX foaf: <http://xmlns.com/foaf/0.1/> SELECT ?member WHERE { <https://solid.interactions.ics.unisg.ch/teofieldmarsham/group-members.ttl> foaf:member ?member . }"
(node:47563) [DEP0040] DeprecationWarning: The punycode module is deprecated. Please use a userland alternative instead.
(Use node --trace-deprecation ... to show where the warning was created)
[
{"member":"https://solid.interactions.ics.unisg.ch/teofieldmarsham/profile/card#me"},
{"member":"https://solid.interactions.ics.unisg.ch/nicokeller1/profile/card#me"}
]
nicolaskeller@eduroamstud-10-255-150-208 Assignment6 %


The answer we got using in task 2 is correct, as it shows all the members of the group, while the answer we got with link traversal 
shows repeated entries. The repeated entries could be due to duplicates in the dataset or could also be due to the nature of link traversal retrieving data 
from multiple sources. Now, the query without link traversal could yield fewer results than the one with link traversal, as it does not
follow the links to all the documents for any other additional information. Nevertheless, it is still correct in our case


