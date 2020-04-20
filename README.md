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
            * certainContents (array)
               * 0 (object)
                  * id (string)
                  * count (number)
                  * parentProps (boolean)
                  * props (array)
                        * 0 (object)
                            * id (string)
                            * chance (number)
                            * excludes (string)
                            * if (string)
                            * ifNot (string)
                  * if (string)
                  * ifNot (string)
            * contentsCount (array)
                * 0 (number)
                * 1 (number)
            * contents (array)
                * 0 (object)
                    * id (string)
                    * weight (number)
                    * parentProps (boolean)
                    * props (array)
                        * 0 (object)
                            * id (string)
                            * chance (number)
                            * excludes (string)
                            * if (string)
                            * ifNot (string)
                        ...
                    * if (string)
                    * ifNot (string)
                ...
        ...
        
The parentProps boolean will copy all properties from the parent (e.g. a red giant star system -> red giant star) though it also removes
asterisks to allow for invisible properties on parents (e.g. red* giant* star system (with red* and giant* having "" for names) -> red giant star). If a parent property has - at the end then it won't be passed on.
