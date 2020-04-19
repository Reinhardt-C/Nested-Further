# Nested-Further
Orteil's Nested but better in every way and easily moddable

JSON structure:

    * properties
        * property (object)
            * id (string)
            * name (string)
        ...
    * objects
        * object (object)
            * id (string)
            * name (string)
            * contentsCount (array)
                * 0 (number)
                * 1 (number)
            * contents (array)
                * 0 (object)
                    * id (string)
                    * weight (number)
                    * props (array)
                        * 0 (object)
                            * id (string)
                            * chance (number)
                            * excludes (string)
                        ...
                    * if (string)
                    * ifNot (string)
                ...
        ...
