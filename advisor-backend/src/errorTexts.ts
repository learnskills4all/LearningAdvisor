// This file contains all the execption messages of the entire application.
// From the following, the list of exceptions are grouped page wise. So that it's easier to track down where these exceptions are used.
// Before every exception, there is a small comment to have an idea about what the error is about. Just for tracking purpose.
// Also, if the same error is being used in multiple pages, the reference of it is made as comments right next to the error.

export const ErrorList = {

    // Page - Answer

    // Conflict in answers
    ConflictAnswer: {
        errorMessage: `Answer with this name already exists`
    },
    // Template not found   // Also used in pages - catrgoty, maturity, template
    TemplateNotFound: {
        errorMessage: `Template not found`
    },
    // Answer not found
    AnswerNotFound: {
        errorMessage: `Answer not found`
    },


    // Page - Assessment

        // Page - 1. Assessment

    // No team ID present
    BadTeamID: {
        errorMessage: `Team id is required for team assessment`
    },
    // Team ID not found        // Also used in page - teams
    TeamIDNotFound: {
        errorMessage: `Team with given team id not found`
    },
    // Team ID not needed in individual assessment
    BadTeamIDIndividual: {
        errorMessage: `Team id is not required for individual assessment`
    },
    // no active template
    BadActiveTemplate: {
        errorMessage: `No active templates found`
    },
    // Conflict with assessment name and type
    ConflictAssessment: {
        errorMessage: `Assessment with this name and type already exists`
    },
    // Assessment not found
    AssessmentNotFound: {
        errorMessage: `Assessment not found`
    },
    // All checkpoints must be filled
    BadFillCheckpoint: {
        errorMessage: `All checkpoints must be filled before marking assessment as complete`
    },



        //Page - 2. Assessment score

    // Assessment ID not found
    AssessmentIDNotFound: {
        errorMessage: `Assessment with given assessment id not found`
    },
    // Individual assessment cannot be scored
    ForbiddenIndividualAssessmentScore: {
        errorMessage: `Individual assessment cannot be scored`
    },
    // Assessment not completed
    BadAssessmentComplete: {
        errorMessage: `Assessment not completed`
    },
    // Maturities not enabled w.r.t. template
    BadMaturityTemplate: {
        errorMessage: `No enabled maturities found associated to this template`
    },
    // Category not enabled w.r.t. template
    BadCategoryTemplate: {
        errorMessage: `No enabled categories found associated to this template`
    },
    // Topic not found w.r.t. template
    BadTopicTemplate: {
        errorMessage: `Topic not found or not enabled for this template`
    },
    // Checkpoint not enabled w.r.t. template
    BadCheckpointTemplate: {
        errorMessage: `No enabled checkpoints found associated to this template`
    },
    // Answer not fount w.r.t. template
    BadAnswerTemplate: {
        errorMessage: `No enabled possible answers found associated to this template`
    },



    // Page - Authentication Local Strategy
 
    // User not logged in
    LoginNotAuthorized: {
        errorMessage: `User not logged in`
    },

 
    // Page - Authentication

    // invalid password
    PassNotAuthorized: {
        errorMessage: `invalid password`
    },



    // Page - Category

    // Conflict with template name and type   // Also used in page - template
    ConflictTemplate: { 
        errorMessage: `Template with this name and type already exists`
    },
    // category not found    // Also used in pages - checkpoint, subarea
    CategoryNotFound: {
        errorMessage: `Category not found`
    },
    // order valid in template
    BadOrderTemplate: {
        errorMessage: `Order must be less than number of categories in template`
    },
    // category name already exists
    ConflictCategoryName: {
        errorMessage: `Category with this name already exists`
    },



    // Page - Change Password

    // Wrong user password
    WrongPassword: {
        errorMessage: `Incorrect password`
    },



    // Page - Checkpoint

    // Maturity not found    // Also used in page - maturity
    MaturityNotFound: {
        errorMessage: `No enabled maturities found`
    },
    // Checkpoint descriptions already exists
    ConflictCheckpointDescription: {
        errorMessage: `Checkpoint with this description already exists`
    },
    // checkpoint not found
    CheckpointNotFound: {
        errorMessage: `The checkpoint was not found`
    },
    //  weight out of range
    BadWeightRange: {
        errorMessage: `Weight is outside of range`
    },
    // order valid in category
    BadOrderCategory: {
        errorMessage: `Order must be less than number of checkpoints in the category`
    },
    // checkpoint name already exists
    ConflictCheckpointName: {
        errorMessage: `Checkpoint with this name already exists`
    },



    //Page - Feedback

    // Feedback not found
    FeedbackNotFound: {
        errorMessage: `Feedback not found`
    },
    // Order too high
    BadOrder: { 
        errorMessage: `New Order is much higher than the maximum order`
    },



    // Page - Forgot Password

    // User not found from the DB   // Also used in pages - Auth, user
    UserNotFound: {
        errorMessage: `User not found`,
    },
    // Expired token to reset password
    BadToken: {
        errorMessage: `cannot verify token or token expired`,
    },
    // User not authorized with respective token
    NotAuthorizedUser: {
        errorMessage: `User not authorized to change password`
    },



    // Page - Maturity

    // Maturity name already exists
    ConflictMaturityName: {
        errorMessage: `Maturity with this name already exists`
    },
    // Maturity order less than maturity number in template
    BadMaturityOrderTemplate: {
        errorMessage: `Maturity order must be less than number of maturities in template`
    },
    


    // Page - Save
    
    // no answer not allowed in template
    BadNoAnswerTemplate: {
        errorMessage: `No answer is not allowed in this template`
    },



    // Page - SubArea

    // conflict with subarea name
    ConflictSubareaName: {
        errorMessage: `Subarea with this name already exists`
    },
    // subarea not found
    SubareaNotFound: {
        errorMessage: `Subarea not found`
    },
    // order greater than number of subarea
    ConflictOrderSubarea: {
        errorMessage: `Order cannot be greater than amount of subareas`
    },

    // Page - Teams

    // Invite token not found
    TeamTokenNotFound: {
        errorMessage: `Team with given invite_token not found`
    },
    // User already in team
    ConflictUserInTeam: {
        errorMessage: `User is already associated to the team`
    },
    // Team not found with ID
    TeamNotFound: {
        errorMessage: `Team with given team id not found`
    },
    // Team member not found
    TeamMemberNotFound: {
        errorMessage: `Team member not found`
    },

    //Page - template

    //weight min < max
    WeightMinMax: {
        errorMessage: `Weight range min must be less than weight range max`
    },
    // weight max > min
    WeightMaxMin: {
        errorMessage: `Weight range max must be greater than weight range min`
    },


    
    //Page - template clone

    //template creation failed
    TemplateFail: {
        errorMessage: `Failed to create new template`
    },



    // Page - Topic

    //topic name already exists
    ConflictTopic: {
        errorMessage: `Topic with this name already exists`
    },
    // topic not found
    TopicNotFound: {
        errorMessage: `Topic not found`
    },



    // Page - User

    // user id not found
    UserIDNotFound: {
        errorMessage: `User with given user id is not found`
    },
    //user already exists
    BadUser: {
        errorMessage: `user exists`
    },
    //username already exists
    ConflictUser: {
        errorMessage: `Username already exists`
    },
    //


}