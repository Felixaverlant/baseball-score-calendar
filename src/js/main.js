$(document).ready(function() {

    $(".chosen").chosen({
        no_results_text: "Oops, nothing found!"
    });

    d3.csv('dist/data/teams.csv', function(err, csv) {
        $.each(csv, function(i,v) {
            $(".chosen").append($("<option value=" + v.team_id + "></option>")
                .text(v.loc_team_tx + ' ' + v.name_team_tx));
            $('.chosen').trigger("chosen:updated");
        })
    });

    $('.chosen').on('change', function(evt, params) {
        $("svg").remove()
        draw_calendar(params.selected);
    });

});
