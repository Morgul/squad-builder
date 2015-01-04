// ---------------------------------------------------------------------------------------------------------------------
// FilterService
//
// @module filters.js
// ---------------------------------------------------------------------------------------------------------------------

function CapitalizeFilterFactory()
{
    return function(input)
    {
        return input.substr(0, 1).toUpperCase() + input.substr(1);
    }; // end function
} // end CapitalizeFilterFactory

function UniqueFilterFactory()
{
    return function(cards, squad, squadMember)
    {
        function inUse(card)
        {
            var used = false;

            _.each(squad, function(member)
            {
                if(squadMember != member)
                {
                    // Check Pilot
                    if(member.pilot && (member.pilot.canonicalName == card.canonicalName))
                    {
                        used = true;
                    } // end if

                    // Check upgrades
                    if(_.find(_.values(member.upgrades), { canonicalName: card.canonicalName }))
                    {
                        used = true;
                    } // end if
                } // end if
            });

            return used;
        } // end inUse

        var filtered = [];
        _.each(cards, function(card)
        {
            if(!card.unique || !inUse(card))
            {
                filtered.push(card);
            } // end if
        });

        return filtered;
    }; // end function
} // end UniqueFilterFactory

function LimitedFilterFactory()
{
    return function(cards, member)
    {
        function inUse(card)
        {
            var used = false;

            // Check upgrades
            if(_.find(_.values(member.upgrades), { canonicalName: card.canonicalName }))
            {
                used = true;
            } // end if

            return used;
        } // end inUse

        var filtered = [];
        _.each(cards, function(card)
        {
            if(!card.limited || !inUse(card))
            {
                filtered.push(card);
            } // end if
        });

        return filtered;
    }; // end function
} // end LimitedFilterFactory

// ---------------------------------------------------------------------------------------------------------------------

angular.module('squad-builder').filter('capitalize', [CapitalizeFilterFactory]);
angular.module('squad-builder').filter('uniqueRule', [UniqueFilterFactory]);
angular.module('squad-builder').filter('limitedRule', [LimitedFilterFactory]);

// ---------------------------------------------------------------------------------------------------------------------