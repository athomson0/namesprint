from const import NLP


def has_user_asked_question(input):
    doc = NLP(input)

    if len(doc) > 0 and doc[0].tag_ == "WP":
        return True

    if (
        len(doc) > 1
        and (doc[0].tag_ == "VB" or doc[0].tag_ == "VBZ")
        and (doc[1].tag_ == "PRP" or doc[1].tag_ == "DT")
    ):
        return True

    if "VB" in [token.tag_ for token in doc] and (
        "?" in input
        or input.lower().startswith("could ")
        or input.lower().startswith("suggest ")
        or input.lower().startswith("generate ")
        or input.lower().startswith("provide ")
    ):
        return True

    return False
